import { For, Show, createSignal, onMount } from "solid-js";

import {
  listAdminEvents,
  createAdminEvent,
  createAdminMatchEventBundle,
  createAdminEventMarkets,
  createAdminEventMarketLadder,
  createAdminMarket,
  getAdminMatchMarketCatalog,
  publishAdminEventMarkets,
  publishAdminEventShell,
  updateAdminEventMatchup,
  type AdminPublicationStatusFilter,
  type CreateEventMarketLadderRequest,
  type CreateEventMarketsRequest,
  type CreateEventMarketsResponse,
  type CreateMatchEventRequest,
  type CreateMatchMarketTemplateSelectionRequest,
  type CreateEventRequest,
  type CreateEventResponse,
  type EventMatchup,
  type EventDetailResponse,
  type EventMarketsResponse,
  type CreateMarketRequest,
  type CreateMarketResponse,
  type MatchMarketCatalogResponse,
  type UpdateEventMatchupRequest,
} from "~/lib/api/admin";
import { getErrorMessage } from "~/lib/api/core";
import { useAsyncTask } from "~/lib/hooks/useAsyncTask";

import AdminImageUrlField from "./AdminImageUrlField";

export type MarketCreationModalType =
  | "single_binary"
  | "multi_market_event"
  | "sports_match_market"
  | "ladder_market";
export type MultiMarketEventStep =
  | "match_bundle"
  | "event_shell"
  | "manual_markets"
  | "ladder_markets"
  | "publish_event"
  | "publish_markets"
  | "update_matchup";

export interface MarketCreationModalInitialEvent {
  id: string;
  slug: string | null;
  publicationStatus?: string | null;
  step?: MultiMarketEventStep;
}

interface AdminMarketCreationModalProps {
  type: MarketCreationModalType;
  initialEvent?: MarketCreationModalInitialEvent;
  onBack: () => void;
  onClose: () => void;
}

interface EventMarketDraft {
  id: string;
  label: string;
  slug: string;
  question: string;
  end_time: string;
  oracle_address: string;
  outcomes: string;
  sort_order: string;
}

interface MatchMarketTemplateDraft {
  template_key: string;
  label: string;
  description: string;
  supports_lines: boolean;
  selected: boolean;
  lines: string;
  generated_selections: Array<{
    selection_key: string;
    label: string;
  }>;
}

interface StoredActiveEvent {
  id: string;
  slug: string | null;
  publication_status: string | null;
  matchup?: EventMatchup | null;
}

const ACTIVE_MULTI_MARKET_EVENT_STORAGE_KEY = "pm-admin-active-multi-market-event";
const ADMIN_EVENT_LOOKUP_LIMIT = 100;
const ADMIN_EVENT_LOOKUP_MAX_PAGES = 12;

let nextEventMarketDraftId = 0;

function createEventMarketDraft(): EventMarketDraft {
  nextEventMarketDraftId += 1;

  return {
    id: `modal-event-market-draft-${nextEventMarketDraftId}`,
    label: "",
    slug: "",
    question: "",
    end_time: "",
    oracle_address: "",
    outcomes: "Yes\nNo",
    sort_order: "",
  };
}

function readRequiredText(formData: FormData, key: string, label: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function readOptionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  return value ? value : undefined;
}

function readStringList(formData: FormData, key: string) {
  const rawValue = String(formData.get(key) ?? "");

  const values = rawValue
    .split(/\r?\n|,/)
    .map(value => value.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
}

function readDateTimeValue(
  formData: FormData,
  key: string,
  label: string,
  options: { required?: boolean } = {},
) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    if (options.required) {
      throw new Error(`${label} is required.`);
    }

    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${label} must be a valid date and time.`);
  }

  return parsed.toISOString();
}

function readOptionalNonNegativeInteger(formData: FormData, key: string, label: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${label} must be a whole number greater than or equal to zero.`);
  }

  return parsed;
}

function buildMatchParticipant(
  formData: FormData,
  prefix: "home" | "away",
  label: string,
): EventMatchup["home"] {
  const score = readOptionalNonNegativeInteger(formData, `${prefix}_score`, `${label} score`);

  return {
    name: readRequiredText(formData, `${prefix}_name`, `${label} name`),
    ...(readOptionalText(formData, `${prefix}_short_name`)
      ? { short_name: readOptionalText(formData, `${prefix}_short_name`)! }
      : {}),
    ...(readOptionalText(formData, `${prefix}_code`)
      ? { code: readOptionalText(formData, `${prefix}_code`)! }
      : {}),
    ...(readOptionalText(formData, `${prefix}_image_url`)
      ? { image_url: readOptionalText(formData, `${prefix}_image_url`)! }
      : {}),
    ...(score !== undefined ? { score } : {}),
  };
}

function buildMatchupFromFormData(formData: FormData): EventMatchup {
  return {
    sport_slug: readRequiredText(formData, "sport_slug", "Sport slug"),
    status: readRequiredText(formData, "match_status", "Match status"),
    ...(readOptionalText(formData, "competition_name")
      ? { competition_name: readOptionalText(formData, "competition_name")! }
      : {}),
    ...(readOptionalText(formData, "round_name")
      ? { round_name: readOptionalText(formData, "round_name")! }
      : {}),
    ...(readOptionalText(formData, "fixture_id")
      ? { fixture_id: readOptionalText(formData, "fixture_id")! }
      : {}),
    home: buildMatchParticipant(formData, "home", "Home team"),
    away: buildMatchParticipant(formData, "away", "Away team"),
  };
}

function buildCreateMarketPayload(formData: FormData): CreateMarketRequest {
  const market: CreateMarketRequest["market"] = {
    title: readRequiredText(formData, "title", "Title"),
    slug: readRequiredText(formData, "slug", "Slug"),
    category_slug: readRequiredText(formData, "category_slug", "Category slug"),
    rules: readRequiredText(formData, "rules", "Rules"),
    end_time: readDateTimeValue(formData, "end_time", "End time", {
      required: true,
    })!,
    ...(readOptionalText(formData, "subcategory_slug")
      ? { subcategory_slug: readOptionalText(formData, "subcategory_slug")! }
      : {}),
    ...(readStringList(formData, "tag_slugs")
      ? { tag_slugs: readStringList(formData, "tag_slugs")! }
      : {}),
    ...(readOptionalText(formData, "image_url")
      ? { image_url: readOptionalText(formData, "image_url")! }
      : {}),
    ...(readOptionalText(formData, "summary")
      ? { summary: readOptionalText(formData, "summary")! }
      : {}),
    ...(readOptionalText(formData, "context")
      ? { context: readOptionalText(formData, "context")! }
      : {}),
    ...(readOptionalText(formData, "additional_context")
      ? { additional_context: readOptionalText(formData, "additional_context")! }
      : {}),
    ...(readDateTimeValue(formData, "sort_at", "Sort at")
      ? { sort_at: readDateTimeValue(formData, "sort_at", "Sort at")! }
      : {}),
    ...(readStringList(formData, "outcomes")
      ? { outcomes: readStringList(formData, "outcomes")! }
      : {}),
    ...(readStringList(formData, "resolution_sources")
      ? { resolution_sources: readStringList(formData, "resolution_sources")! }
      : {}),
    ...(readOptionalText(formData, "resolution_timezone")
      ? { resolution_timezone: readOptionalText(formData, "resolution_timezone")! }
      : {}),
    featured: Boolean(formData.get("featured")),
    breaking: Boolean(formData.get("breaking")),
    searchable: Boolean(formData.get("searchable")),
    visible: Boolean(formData.get("visible")),
    hide_resolved_by_default: Boolean(formData.get("hide_resolved_by_default")),
  };

  const chain: CreateMarketRequest["chain"] = {
    oracle_address: readRequiredText(formData, "oracle_address", "Oracle address"),
    ...(formData.get("neg_risk") ? { neg_risk: true } : {}),
  };

  return {
    market,
    chain,
    ...(formData.get("publish_now") ? { publish: { mode: "publish" as const } } : {}),
  };
}

function buildCreateEventPayload(formData: FormData): CreateEventRequest {
  const event: CreateEventRequest["event"] = {
    title: readRequiredText(formData, "title", "Title"),
    slug: readRequiredText(formData, "slug", "Slug"),
    category_slug: readRequiredText(formData, "category_slug", "Category slug"),
    rules: readRequiredText(formData, "rules", "Rules"),
    ...(readOptionalText(formData, "subcategory_slug")
      ? { subcategory_slug: readOptionalText(formData, "subcategory_slug")! }
      : {}),
    ...(readStringList(formData, "tag_slugs")
      ? { tag_slugs: readStringList(formData, "tag_slugs")! }
      : {}),
    ...(readOptionalText(formData, "image_url")
      ? { image_url: readOptionalText(formData, "image_url")! }
      : {}),
    ...(readOptionalText(formData, "summary")
      ? { summary: readOptionalText(formData, "summary")! }
      : {}),
    ...(readOptionalText(formData, "context")
      ? { context: readOptionalText(formData, "context")! }
      : {}),
    ...(readOptionalText(formData, "additional_context")
      ? { additional_context: readOptionalText(formData, "additional_context")! }
      : {}),
    ...(readDateTimeValue(formData, "starts_at", "Starts at")
      ? { starts_at: readDateTimeValue(formData, "starts_at", "Starts at")! }
      : {}),
    ...(readDateTimeValue(formData, "sort_at", "Sort at")
      ? { sort_at: readDateTimeValue(formData, "sort_at", "Sort at")! }
      : {}),
    ...(readStringList(formData, "resolution_sources")
      ? { resolution_sources: readStringList(formData, "resolution_sources")! }
      : {}),
    ...(readOptionalText(formData, "resolution_timezone")
      ? { resolution_timezone: readOptionalText(formData, "resolution_timezone")! }
      : {}),
    featured: Boolean(formData.get("featured")),
    breaking: Boolean(formData.get("breaking")),
    searchable: Boolean(formData.get("searchable")),
    visible: Boolean(formData.get("visible")),
    hide_resolved_by_default: Boolean(formData.get("hide_resolved_by_default")),
  };

  const chain: CreateEventRequest["chain"] = {
    group_key: readRequiredText(formData, "group_key", "Group key"),
    series_key: readRequiredText(formData, "series_key", "Series key"),
    ...(formData.get("neg_risk") ? { neg_risk: true } : {}),
  };

  return {
    event,
    chain,
    ...(formData.get("publish_now") ? { publish: { mode: "publish" as const } } : {}),
  };
}

function buildOptionalEventMarketsPayload(
  drafts: EventMarketDraft[],
): CreateMatchEventRequest["markets"]["additional_markets"] {
  if (drafts.length === 0) {
    return undefined;
  }

  return buildEventMarketsPayload(drafts);
}

function buildCreateMatchEventPayload(
  formData: FormData,
  additionalMarketsDrafts: EventMarketDraft[],
  templateDrafts: MatchMarketTemplateDraft[],
): CreateMatchEventRequest {
  const event: CreateMatchEventRequest["event"] = {
    title: readRequiredText(formData, "title", "Title"),
    slug: readRequiredText(formData, "slug", "Slug"),
    category_slug: readRequiredText(formData, "category_slug", "Category slug"),
    rules: readRequiredText(formData, "rules", "Rules"),
    starts_at: readDateTimeValue(formData, "starts_at", "Starts at", {
      required: true,
    })!,
    matchup: buildMatchupFromFormData(formData),
    ...(readOptionalText(formData, "subcategory_slug")
      ? { subcategory_slug: readOptionalText(formData, "subcategory_slug")! }
      : {}),
    ...(readStringList(formData, "tag_slugs")
      ? { tag_slugs: readStringList(formData, "tag_slugs")! }
      : {}),
    ...(readOptionalText(formData, "image_url")
      ? { image_url: readOptionalText(formData, "image_url")! }
      : {}),
    ...(readOptionalText(formData, "summary")
      ? { summary: readOptionalText(formData, "summary")! }
      : {}),
    ...(readOptionalText(formData, "context")
      ? { context: readOptionalText(formData, "context")! }
      : {}),
    ...(readOptionalText(formData, "additional_context")
      ? { additional_context: readOptionalText(formData, "additional_context")! }
      : {}),
    ...(readDateTimeValue(formData, "sort_at", "Sort at")
      ? { sort_at: readDateTimeValue(formData, "sort_at", "Sort at")! }
      : {}),
    ...(readStringList(formData, "resolution_sources")
      ? { resolution_sources: readStringList(formData, "resolution_sources")! }
      : {}),
    ...(readOptionalText(formData, "resolution_timezone")
      ? { resolution_timezone: readOptionalText(formData, "resolution_timezone")! }
      : {}),
    featured: Boolean(formData.get("featured")),
    breaking: Boolean(formData.get("breaking")),
    searchable: Boolean(formData.get("searchable")),
    visible: Boolean(formData.get("visible")),
    hide_resolved_by_default: Boolean(formData.get("hide_resolved_by_default")),
  };

  const chain: CreateMatchEventRequest["chain"] = {
    ...(formData.get("neg_risk") ? { neg_risk: true } : {}),
    ...(readOptionalText(formData, "group_key")
      ? { group_key: readOptionalText(formData, "group_key")! }
      : {}),
    ...(readOptionalText(formData, "series_key")
      ? { series_key: readOptionalText(formData, "series_key")! }
      : {}),
  };

  const template_selections = buildTemplateSelectionsPayload(templateDrafts);
  const additional_markets = buildOptionalEventMarketsPayload(additionalMarketsDrafts);

  if (template_selections.length === 0 && !additional_markets) {
    throw new Error("Select at least one match template or add a custom child market.");
  }

  const markets: CreateMatchEventRequest["markets"] = {
    oracle_address: readRequiredText(formData, "oracle_address", "Oracle address"),
    register_neg_risk: Boolean(formData.get("register_neg_risk")),
    template_selections,
    ...(readDateTimeValue(formData, "market_lock_at", "Market lock at")
      ? { market_lock_at: readDateTimeValue(formData, "market_lock_at", "Market lock at")! }
      : {}),
    ...(additional_markets ? { additional_markets } : {}),
  };

  return {
    event,
    chain,
    markets,
    ...(readOptionalText(formData, "publish_mode")
      ? { publish: { mode: readOptionalText(formData, "publish_mode") as "draft" | "prepare" | "publish" } }
      : {}),
  };
}

function buildUpdateEventMatchupPayload(formData: FormData): UpdateEventMatchupRequest {
  return {
    matchup: buildMatchupFromFormData(formData),
  };
}

function buildCreateEventMarketLadderSubmission(formData: FormData) {
  const eventId = readRequiredText(formData, "event_id", "Event ID");
  const underlying = readRequiredText(formData, "underlying", "Underlying");
  const deadlineLabel = readRequiredText(formData, "deadline_label", "Deadline label");
  const endTime = readDateTimeValue(formData, "end_time", "End time", {
    required: true,
  });
  const oracleAddress = readRequiredText(formData, "oracle_address", "Oracle address");
  const unitSymbol = readOptionalText(formData, "unit_symbol");
  const upThresholds = readStringList(formData, "up_thresholds");
  const downThresholds = readStringList(formData, "down_thresholds");

  if (!upThresholds && !downThresholds) {
    throw new Error("Add at least one up or down threshold.");
  }

  return {
    eventId,
    payload: {
      template: {
        underlying,
        deadline_label: deadlineLabel,
        end_time: endTime!,
        oracle_address: oracleAddress,
        ...(unitSymbol ? { unit_symbol: unitSymbol } : {}),
        ...(upThresholds ? { up_thresholds: upThresholds } : {}),
        ...(downThresholds ? { down_thresholds: downThresholds } : {}),
      },
      ...(formData.get("publish_now") ? { publish: { mode: "publish" as const } } : {}),
    } satisfies CreateEventMarketLadderRequest,
  };
}

function buildEventMarketsPayload(
  drafts: EventMarketDraft[],
): CreateEventMarketsRequest["markets"] {
  if (drafts.length === 0) {
    throw new Error("Add at least one market.");
  }

  return drafts.map((draft, index) => {
    const label = draft.label.trim();
    const slug = draft.slug.trim();
    const question = draft.question.trim();
    const endTimeRaw = draft.end_time.trim();
    const oracleAddress = draft.oracle_address.trim();

    if (!label) {
      throw new Error(`Market ${index + 1}: label is required.`);
    }

    if (!slug) {
      throw new Error(`Market ${index + 1}: slug is required.`);
    }

    if (!question) {
      throw new Error(`Market ${index + 1}: question is required.`);
    }

    if (!endTimeRaw) {
      throw new Error(`Market ${index + 1}: end time is required.`);
    }

    if (!oracleAddress) {
      throw new Error(`Market ${index + 1}: oracle address is required.`);
    }

    const endTime = new Date(endTimeRaw);

    if (Number.isNaN(endTime.getTime())) {
      throw new Error(`Market ${index + 1}: end time must be valid.`);
    }

    const outcomes = draft.outcomes
      .split(/\r?\n|,/)
      .map(value => value.trim())
      .filter(Boolean);

    const rawSortOrder = draft.sort_order.trim();
    let sortOrder: number | undefined;

    if (rawSortOrder) {
      const parsed = Number.parseInt(rawSortOrder, 10);

      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Market ${index + 1}: sort order must be a positive whole number.`);
      }

      sortOrder = parsed;
    }

    return {
      label,
      slug,
      question,
      end_time: endTime.toISOString(),
      oracle_address: oracleAddress,
      ...(outcomes.length > 0 ? { outcomes } : {}),
      ...(sortOrder !== undefined ? { sort_order: sortOrder } : {}),
    };
  });
}

function buildCreateEventMarketsSubmission(
  eventId: string,
  publishNow: boolean,
  drafts: EventMarketDraft[],
) {
  const normalizedEventId = eventId.trim();

  if (!normalizedEventId) {
    throw new Error("Event ID is required.");
  }

  return {
    eventId: normalizedEventId,
    payload: {
      markets: buildEventMarketsPayload(drafts),
      ...(publishNow ? { publish: { mode: "publish" as const } } : {}),
    } satisfies CreateEventMarketsRequest,
  };
}

function formatTimestamp(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

function readStoredActiveEvent(): StoredActiveEvent | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(ACTIVE_MULTI_MARKET_EVENT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as {
      id?: unknown;
      slug?: unknown;
      matchup?: unknown;
      publication_status?: unknown;
    };

    if (typeof parsed.id !== "string" || !parsed.id.trim()) {
      return null;
    }

    return {
      id: parsed.id.trim(),
      slug: typeof parsed.slug === "string" && parsed.slug.trim() ? parsed.slug.trim() : null,
      publication_status:
        typeof parsed.publication_status === "string" && parsed.publication_status.trim()
          ? parsed.publication_status.trim()
          : null,
      matchup:
        parsed.matchup && typeof parsed.matchup === "object"
          ? (parsed.matchup as EventMatchup)
          : null,
    };
  } catch {
    return null;
  }
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4.5 4.5L13.5 13.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
      <path
        d="M13.5 4.5L4.5 13.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M7 4.5L2.5 9L7 13.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
      <path
        d="M3 9H15.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>
  );
}

async function findAdminEventBySlug(slug: string) {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new Error("Event slug is required.");
  }

  for (let pageIndex = 0; pageIndex < ADMIN_EVENT_LOOKUP_MAX_PAGES; pageIndex += 1) {
    const offset = pageIndex * ADMIN_EVENT_LOOKUP_LIMIT;
    const response = await listAdminEvents({
      publication_status: "all",
      limit: ADMIN_EVENT_LOOKUP_LIMIT,
      offset,
    });
    const match = response.events.find(event => event.slug === normalizedSlug);

    if (match) {
      return match;
    }

    if (response.events.length < ADMIN_EVENT_LOOKUP_LIMIT) {
      break;
    }
  }

  throw new Error("Could not recover the admin event ID for the created match event.");
}

function getModalMeta(type: MarketCreationModalType) {
  switch (type) {
    case "single_binary":
      return {
        eyebrow: "Create",
        title: "Single Binary Market",
        copy: "Create one standalone Yes/No market. This form uses the existing image upload endpoint for the market image field.",
      };
    case "multi_market_event":
      return {
        eyebrow: "Create",
        title: "Multi-Market Event",
        copy: "Create the parent event shell first, then continue with manual child markets or ladder generation.",
      };
    case "sports_match_market":
      return {
        eyebrow: "Create",
        title: "Sports Match Market",
        copy: "Create a match event bundle with structured matchup metadata plus catalog-selected child markets in one request.",
      };
    case "ladder_market":
      return {
        eyebrow: "Create",
        title: "Ladder Market",
        copy: "Generate threshold-based sibling markets under an existing event shell. Start with the event ID you want to attach them to.",
      };
  }
}

function getDefaultEventFlowStep(type: MarketCreationModalType): MultiMarketEventStep {
  return type === "sports_match_market" ? "match_bundle" : "event_shell";
}

function buildMatchMarketTemplateDrafts(
  catalog: MatchMarketCatalogResponse,
): MatchMarketTemplateDraft[] {
  return catalog.templates.map(template => ({
    template_key: template.template_key,
    label: template.label,
    description: template.description,
    supports_lines: template.supports_lines,
    selected: template.default_selected,
    lines: template.default_lines.join("\n"),
    generated_selections: template.generated_selections.map(selection => ({
      selection_key: selection.selection_key,
      label: selection.label,
    })),
  }));
}

function buildTemplateSelectionsPayload(
  drafts: MatchMarketTemplateDraft[],
): CreateMatchMarketTemplateSelectionRequest[] {
  return drafts
    .filter(template => template.selected)
    .map(template => ({
      template_key: template.template_key,
      ...(template.supports_lines
        ? {
            lines: template.lines
              .split(/\r?\n|,/)
              .map(value => value.trim())
              .filter(Boolean),
          }
        : {}),
    }));
}

function getResumeStepForEvent(
  type: MarketCreationModalType,
  publicationStatus: string | null | undefined,
  _matchup: EventMatchup | null | undefined,
): MultiMarketEventStep {
  if (type === "sports_match_market") {
    return publicationStatus === "published" ? "update_matchup" : "publish_event";
  }

  return "manual_markets";
}

function CreatedMarketResult(props: { response: CreateMarketResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Created</p>
          <h3 class="pm-market-result__title">{props.response.market.slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.market.publication_status}</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Market ID</span>
          <span class="pm-market-result__value">{props.response.market.id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Wrapper event</span>
          <span class="pm-market-result__value">{props.response.event.slug}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Question ID</span>
          <span class="pm-market-result__value">{props.response.market.question_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Created</span>
          <span class="pm-market-result__value">{formatTimestamp(props.response.created_at)}</span>
        </div>
      </div>
    </section>
  );
}

function CreatedEventResult(props: { response: CreateEventResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Created</p>
          <h3 class="pm-market-result__title">{props.response.event.slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.event.publication_status}</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Admin event ID</span>
          <span class="pm-market-result__value">{props.response.id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Created</span>
          <span class="pm-market-result__value">{formatTimestamp(props.response.created_at)}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Group ID</span>
          <span class="pm-market-result__value">{props.response.on_chain.group_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Series ID</span>
          <span class="pm-market-result__value">{props.response.on_chain.series_id}</span>
        </div>
      </div>
    </section>
  );
}

function MatchBundleResult(props: { response: EventMarketsResponse; eventId: string | null }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Match Bundle Created</p>
          <h3 class="pm-market-result__title">{props.response.event.slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.markets.length} markets</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Admin event ID</span>
          <span class="pm-market-result__value">{props.eventId ?? "Recovering..."}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Publication</span>
          <span class="pm-market-result__value">{props.response.event.publication_status}</span>
        </div>
        <div>
          <span class="pm-market-result__label">On-chain event ID</span>
          <span class="pm-market-result__value">{props.response.on_chain.event_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Markets count</span>
          <span class="pm-market-result__value">{props.response.markets.length}</span>
        </div>
        <div class="pm-market-result__detail--full">
          <span class="pm-market-result__label">Market slugs</span>
          <span class="pm-market-result__value">
            {props.response.markets.map(market => market.slug).join(", ")}
          </span>
        </div>
      </div>
    </section>
  );
}

function LadderResult(props: { response: CreateEventMarketsResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Generated</p>
          <h3 class="pm-market-result__title">{props.response.event_slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.markets.length} markets</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Admin event ID</span>
          <span class="pm-market-result__value">{props.response.event_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Count</span>
          <span class="pm-market-result__value">{props.response.markets.length}</span>
        </div>
        <div class="pm-market-result__detail--full">
          <span class="pm-market-result__label">Market slugs</span>
          <span class="pm-market-result__value">
            {props.response.markets.map(market => market.slug).join(", ")}
          </span>
        </div>
      </div>
    </section>
  );
}

function ChildMarketsResult(props: { response: CreateEventMarketsResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Child Markets Added</p>
          <h3 class="pm-market-result__title">{props.response.event_slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.markets.length} markets</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Admin event ID</span>
          <span class="pm-market-result__value">{props.response.event_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Count</span>
          <span class="pm-market-result__value">{props.response.markets.length}</span>
        </div>
        <div class="pm-market-result__detail--full">
          <span class="pm-market-result__label">Market slugs</span>
          <span class="pm-market-result__value">
            {props.response.markets.map(market => market.slug).join(", ")}
          </span>
        </div>
      </div>
    </section>
  );
}

function PublishedEventResult(props: { response: EventDetailResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Event Published</p>
          <h3 class="pm-market-result__title">{props.response.event.slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.event.publication_status}</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Markets count</span>
          <span class="pm-market-result__value">{props.response.markets_count}</span>
        </div>
        <div>
          <span class="pm-market-result__label">On-chain event ID</span>
          <span class="pm-market-result__value">{props.response.on_chain.event_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Group ID</span>
          <span class="pm-market-result__value">{props.response.on_chain.group_id}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Tx hash</span>
          <span class="pm-market-result__value">
            {props.response.on_chain.tx_hash ?? "Already published"}
          </span>
        </div>
      </div>
    </section>
  );
}

function PublishedChildMarketsResult(props: { response: EventMarketsResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Markets Published</p>
          <h3 class="pm-market-result__title">{props.response.event.slug}</h3>
        </div>
        <span class="pm-market-result__badge">{props.response.markets.length} markets</span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Publication</span>
          <span class="pm-market-result__value">{props.response.event.publication_status}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Published markets</span>
          <span class="pm-market-result__value">{props.response.markets.length}</span>
        </div>
        <div class="pm-market-result__detail--full">
          <span class="pm-market-result__label">Condition IDs</span>
          <span class="pm-market-result__value">
            {props.response.markets
              .map(market => `${market.slug}: ${market.condition_id ?? "pending"}`)
              .join(", ")}
          </span>
        </div>
      </div>
    </section>
  );
}

function UpdatedMatchupResult(props: { response: EventDetailResponse }) {
  return (
    <section class="pm-market-result">
      <div class="pm-market-result__header">
        <div>
          <p class="pm-market-result__eyebrow">Matchup Updated</p>
          <h3 class="pm-market-result__title">{props.response.event.slug}</h3>
        </div>
        <span class="pm-market-result__badge">
          {props.response.event.matchup?.status ?? "updated"}
        </span>
      </div>

      <div class="pm-market-result__grid">
        <div>
          <span class="pm-market-result__label">Markets count</span>
          <span class="pm-market-result__value">{props.response.markets_count}</span>
        </div>
        <div>
          <span class="pm-market-result__label">Home score</span>
          <span class="pm-market-result__value">
            {props.response.event.matchup?.home.score ?? "-"}
          </span>
        </div>
        <div>
          <span class="pm-market-result__label">Away score</span>
          <span class="pm-market-result__value">
            {props.response.event.matchup?.away.score ?? "-"}
          </span>
        </div>
        <div>
          <span class="pm-market-result__label">Status</span>
          <span class="pm-market-result__value">
            {props.response.event.matchup?.status ?? "unknown"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default function AdminMarketCreationModal(props: AdminMarketCreationModalProps) {
  const listEventsTask = useAsyncTask((query: { publication_status?: AdminPublicationStatusFilter }) =>
    listAdminEvents(query),
  );
  const createMarketTask = useAsyncTask((payload: CreateMarketRequest) => createAdminMarket(payload));
  const createEventTask = useAsyncTask((payload: CreateEventRequest) => createAdminEvent(payload));
  const createMatchBundleTask = useAsyncTask((payload: CreateMatchEventRequest) =>
    createAdminMatchEventBundle(payload),
  );
  const matchCatalogTask = useAsyncTask((sportSlug: string) =>
    getAdminMatchMarketCatalog(sportSlug),
  );
  const createEventMarketsTask = useAsyncTask(
    (eventId: string, payload: CreateEventMarketsRequest) =>
      createAdminEventMarkets(eventId, payload),
  );
  const publishEventTask = useAsyncTask((eventId: string) => publishAdminEventShell(eventId));
  const publishEventMarketsTask = useAsyncTask((eventId: string) =>
    publishAdminEventMarkets(eventId),
  );
  const updateEventMatchupTask = useAsyncTask(
    (eventId: string, payload: UpdateEventMatchupRequest) =>
      updateAdminEventMatchup(eventId, payload),
  );
  const createLadderTask = useAsyncTask(
    (eventId: string, payload: CreateEventMarketLadderRequest) =>
      createAdminEventMarketLadder(eventId, payload),
  );
  const [marketError, setMarketError] = createSignal<string | null>(null);
  const [eventError, setEventError] = createSignal<string | null>(null);
  const [matchBundleError, setMatchBundleError] = createSignal<string | null>(null);
  const [matchCatalogError, setMatchCatalogError] = createSignal<string | null>(null);
  const [eventMarketsError, setEventMarketsError] = createSignal<string | null>(null);
  const [publishEventError, setPublishEventError] = createSignal<string | null>(null);
  const [publishEventMarketsError, setPublishEventMarketsError] = createSignal<string | null>(null);
  const [updateMatchupError, setUpdateMatchupError] = createSignal<string | null>(null);
  const [ladderError, setLadderError] = createSignal<string | null>(null);
  const [recoveryError, setRecoveryError] = createSignal<string | null>(null);
  const [recoveryFilter, setRecoveryFilter] = createSignal<AdminPublicationStatusFilter>("draft");
  const [multiMarketEventStep, setMultiMarketEventStep] =
    createSignal<MultiMarketEventStep>("event_shell");
  const [createdEventId, setCreatedEventId] = createSignal("");
  const [createdEventSlug, setCreatedEventSlug] = createSignal<string | null>(null);
  const [createdEventPublicationStatus, setCreatedEventPublicationStatus] = createSignal<
    string | null
  >(null);
  const [activeEventMatchup, setActiveEventMatchup] = createSignal<EventMatchup | null>(null);
  const [rememberedEvent, setRememberedEvent] = createSignal<StoredActiveEvent | null>(null);
  const [publishChildMarketsNow, setPublishChildMarketsNow] = createSignal(false);
  const [matchCatalogSportSlug, setMatchCatalogSportSlug] = createSignal("soccer");
  const [matchTemplateDrafts, setMatchTemplateDrafts] = createSignal<MatchMarketTemplateDraft[]>([]);
  const [matchAdditionalMarketDrafts, setMatchAdditionalMarketDrafts] = createSignal<EventMarketDraft[]>([]);
  const [eventMarketsDrafts, setEventMarketsDrafts] = createSignal<EventMarketDraft[]>([
    createEventMarketDraft(),
  ]);
  const modalMeta = () => getModalMeta(props.type);
  const eventIsPublished = () => createdEventPublicationStatus() === "published";
  const isGenericEventFlow = () => props.type === "multi_market_event";
  const isSportsEventFlow = () => props.type === "sports_match_market";

  function rememberActiveEvent(
    eventId: string,
    slug: string | null,
    publicationStatus: string | null,
    matchup: EventMatchup | null = null,
  ) {
    const normalizedEventId = eventId.trim();

    if (!normalizedEventId) {
      return;
    }

    const nextValue = {
      id: normalizedEventId,
      slug: slug?.trim() ? slug.trim() : null,
      publication_status: publicationStatus?.trim() ? publicationStatus.trim() : null,
      matchup,
    } satisfies StoredActiveEvent;

    setRememberedEvent(nextValue);

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ACTIVE_MULTI_MARKET_EVENT_STORAGE_KEY,
      JSON.stringify(nextValue),
    );
  }

  function clearRememberedEvent() {
    setRememberedEvent(null);

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACTIVE_MULTI_MARKET_EVENT_STORAGE_KEY);
  }

  function resumeEvent(
    eventId: string,
    slug: string | null,
    publicationStatus: string | null,
    step: MultiMarketEventStep = "manual_markets",
    matchup: EventMatchup | null = null,
  ) {
    setCreatedEventId(eventId);
    setCreatedEventSlug(slug);
    setCreatedEventPublicationStatus(publicationStatus);
    setActiveEventMatchup(matchup);
    setMultiMarketEventStep(step);
    rememberActiveEvent(eventId, slug, publicationStatus, matchup);
  }

  async function handleRefreshRecoveryList(filter = recoveryFilter()) {
    setRecoveryError(null);

    try {
      await listEventsTask.run({
        publication_status: filter,
        ...(isSportsEventFlow() ? { category_slug: "sports" } : {}),
      });
    } catch (error) {
      setRecoveryError(getErrorMessage(error));
    }
  }

  async function handleRefreshMatchCatalog(sportSlug = matchCatalogSportSlug()) {
    const normalizedSportSlug = sportSlug.trim();

    if (!normalizedSportSlug) {
      setMatchCatalogError("Sport slug is required to load the match template catalog.");
      setMatchTemplateDrafts([]);
      return;
    }

    setMatchCatalogError(null);
    setMatchCatalogSportSlug(normalizedSportSlug);

    try {
      const response = await matchCatalogTask.run(normalizedSportSlug);
      setMatchTemplateDrafts(buildMatchMarketTemplateDrafts(response));
    } catch (error) {
      setMatchTemplateDrafts([]);
      setMatchCatalogError(getErrorMessage(error));
    }
  }

  onMount(() => {
    if (props.type !== "multi_market_event" && props.type !== "sports_match_market") {
      return;
    }

    setMultiMarketEventStep(getDefaultEventFlowStep(props.type));
    setRememberedEvent(readStoredActiveEvent());

    if (props.initialEvent) {
      resumeEvent(
        props.initialEvent.id,
        props.initialEvent.slug,
        props.initialEvent.publicationStatus ?? null,
        props.initialEvent.step ?? "manual_markets",
        null,
      );
    }

    void handleRefreshRecoveryList();

    if (props.type === "sports_match_market") {
      void handleRefreshMatchCatalog();
    }
  });

  async function handleCreateMarketSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    setMarketError(null);

    try {
      const payload = buildCreateMarketPayload(new FormData(form));
      await createMarketTask.run(payload);
      form.reset();
    } catch (error) {
      setMarketError(getErrorMessage(error));
    }
  }

  async function handleCreateEventSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    setEventError(null);

    try {
      const payload = buildCreateEventPayload(new FormData(form));
      const response = await createEventTask.run(payload);
      resumeEvent(
        response.id,
        response.event.slug,
        response.event.publication_status,
        "manual_markets",
        response.event.matchup ?? null,
      );
      form.reset();
    } catch (error) {
      setEventError(getErrorMessage(error));
    }
  }

  async function handleCreateMatchBundleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    setMatchBundleError(null);

    try {
      const payload = buildCreateMatchEventPayload(
        new FormData(form),
        matchAdditionalMarketDrafts(),
        matchTemplateDrafts(),
      );
      const response = await createMatchBundleTask.run(payload);
      const createdEvent = await findAdminEventBySlug(response.event.slug);

      resumeEvent(
        createdEvent.id,
        response.event.slug,
        response.event.publication_status,
        response.event.publication_status === "published" &&
          response.markets.every(market => market.publication_status === "published")
          ? "update_matchup"
          : response.event.publication_status === "published"
            ? "publish_markets"
            : "publish_event",
        response.event.matchup ?? null,
      );
      setMatchAdditionalMarketDrafts([]);
      form.reset();
    } catch (error) {
      setMatchBundleError(getErrorMessage(error));
    }
  }

  async function handleCreateEventMarketsSubmit(event: SubmitEvent) {
    event.preventDefault();

    setEventMarketsError(null);

    try {
      if (publishChildMarketsNow() && !eventIsPublished()) {
        throw new Error("Publish the event shell first before publishing child markets.");
      }

      const { eventId, payload } = buildCreateEventMarketsSubmission(
        createdEventId(),
        publishChildMarketsNow(),
        eventMarketsDrafts(),
      );
      const response = await createEventMarketsTask.run(eventId, payload);
      rememberActiveEvent(
        response.event_id,
        response.event_slug,
        createdEventPublicationStatus(),
        activeEventMatchup(),
      );
      setEventMarketsDrafts([createEventMarketDraft()]);

      if (!publishChildMarketsNow()) {
        setMultiMarketEventStep(eventIsPublished() ? "publish_markets" : "publish_event");
      }
    } catch (error) {
      setEventMarketsError(getErrorMessage(error));
    }
  }

  async function handlePublishEventSubmit(event: SubmitEvent) {
    event.preventDefault();

    setPublishEventError(null);

    try {
      const response = await publishEventTask.run(createdEventId().trim());
      setCreatedEventSlug(response.event.slug);
      setCreatedEventPublicationStatus(response.event.publication_status);
      setActiveEventMatchup(response.event.matchup ?? activeEventMatchup());
      rememberActiveEvent(
        createdEventId(),
        response.event.slug,
        response.event.publication_status,
        response.event.matchup ?? activeEventMatchup(),
      );
      setMultiMarketEventStep("publish_markets");
    } catch (error) {
      setPublishEventError(getErrorMessage(error));
    }
  }

  async function handlePublishEventMarketsSubmit(event: SubmitEvent) {
    event.preventDefault();

    setPublishEventMarketsError(null);

    try {
      const response = await publishEventMarketsTask.run(createdEventId().trim());
      setCreatedEventSlug(response.event.slug);
      setCreatedEventPublicationStatus(response.event.publication_status);
      setActiveEventMatchup(response.event.matchup ?? activeEventMatchup());
      rememberActiveEvent(
        createdEventId(),
        response.event.slug,
        response.event.publication_status,
        response.event.matchup ?? activeEventMatchup(),
      );
    } catch (error) {
      setPublishEventMarketsError(getErrorMessage(error));
    }
  }

  async function handleUpdateEventMatchupSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    setUpdateMatchupError(null);

    try {
      const payload = buildUpdateEventMatchupPayload(new FormData(form));
      const response = await updateEventMatchupTask.run(createdEventId().trim(), payload);
      setActiveEventMatchup(response.event.matchup ?? null);
      setCreatedEventSlug(response.event.slug);
      setCreatedEventPublicationStatus(response.event.publication_status);
      rememberActiveEvent(
        createdEventId(),
        response.event.slug,
        response.event.publication_status,
        response.event.matchup ?? null,
      );
    } catch (error) {
      setUpdateMatchupError(getErrorMessage(error));
    }
  }

  async function handleCreateLadderSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    setLadderError(null);

    try {
      const formData = new FormData(form);
      const publishNow = Boolean(formData.get("publish_now"));

      if (props.type === "multi_market_event" && createdEventId() && publishNow && !eventIsPublished()) {
        throw new Error("Publish the event shell first before publishing ladder markets.");
      }

      const { eventId, payload } = buildCreateEventMarketLadderSubmission(formData);
      const response = await createLadderTask.run(eventId, payload);
      rememberActiveEvent(
        response.event_id,
        response.event_slug,
        createdEventPublicationStatus(),
        activeEventMatchup(),
      );

      if (props.type === "multi_market_event" && !publishNow) {
        setMultiMarketEventStep(eventIsPublished() ? "publish_markets" : "publish_event");
      }
    } catch (error) {
      setLadderError(getErrorMessage(error));
    }
  }

  function addMatchAdditionalMarketDraft() {
    setMatchAdditionalMarketDrafts(current => [...current, createEventMarketDraft()]);
  }

  function updateMatchTemplateDraft(
    templateKey: string,
    patch: Partial<Pick<MatchMarketTemplateDraft, "selected" | "lines">>,
  ) {
    setMatchTemplateDrafts(current =>
      current.map(template =>
        template.template_key === templateKey ? { ...template, ...patch } : template,
      ),
    );
  }

  function removeMatchAdditionalMarketDraft(id: string) {
    setMatchAdditionalMarketDrafts(current => current.filter(item => item.id !== id));
  }

  function updateMatchAdditionalMarketDraft(
    id: string,
    field: Exclude<keyof EventMarketDraft, "id">,
    value: string,
  ) {
    setMatchAdditionalMarketDrafts(current =>
      current.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  return (
    <>
      <div class="pm-admin-create-modal__overlay" aria-hidden="true" onClick={props.onClose} />

      <section class="pm-admin-create-modal" role="dialog" aria-modal="true" aria-label={modalMeta().title}>
        <header class="pm-admin-create-modal__header">
          <div class="pm-admin-create-modal__header-copy">
            <p class="pm-admin-create-modal__eyebrow">{modalMeta().eyebrow}</p>
            <h2 class="pm-admin-create-modal__title">{modalMeta().title}</h2>
            <p class="pm-admin-create-modal__copy">{modalMeta().copy}</p>
          </div>

          <div class="pm-admin-create-modal__header-actions">
            <button class="pm-admin-create-modal__secondary" type="button" onClick={props.onBack}>
              <BackIcon />
              <span>Back</span>
            </button>
            <button class="pm-admin-create-modal__close" type="button" onClick={props.onClose} aria-label="Close creation modal">
              <CloseIcon />
            </button>
          </div>
        </header>

        <div class="pm-admin-create-modal__body">
          <Show when={props.type === "single_binary"}>
            <div class="pm-admin-create-modal__panel">
              <form class="pm-market-form" onSubmit={handleCreateMarketSubmit}>
                <div class="pm-market-fields">
                  <label class="pm-field">
                    <span class="pm-field__label">Title</span>
                    <input class="pm-field__input" name="title" type="text" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Slug</span>
                    <input class="pm-field__input" name="slug" type="text" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Category slug</span>
                    <input class="pm-field__input" name="category_slug" type="text" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Subcategory slug</span>
                    <input class="pm-field__input" name="subcategory_slug" type="text" />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Oracle address</span>
                    <input class="pm-field__input" name="oracle_address" type="text" placeholder="0x..." required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">End time</span>
                    <input class="pm-field__input" name="end_time" type="datetime-local" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Sort at</span>
                    <input class="pm-field__input" name="sort_at" type="datetime-local" />
                  </label>

                  <AdminImageUrlField name="image_url" scope="markets" />

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Summary</span>
                    <textarea class="pm-field__textarea" name="summary" rows="3" placeholder="Short market summary" />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Tag slugs</span>
                    <textarea class="pm-field__textarea" name="tag_slugs" rows="3" placeholder={"crypto\nmacro"} />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Context</span>
                    <textarea class="pm-field__textarea" name="context" rows="4" />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Additional context</span>
                    <textarea class="pm-field__textarea" name="additional_context" rows="4" />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Rules</span>
                    <textarea class="pm-field__textarea" name="rules" rows="5" required />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Outcomes</span>
                    <textarea class="pm-field__textarea" name="outcomes" rows="3" placeholder={"Yes\nNo"} />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Resolution sources</span>
                    <textarea class="pm-field__textarea" name="resolution_sources" rows="3" placeholder={"https://source.one\nhttps://source.two"} />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Resolution timezone</span>
                    <input class="pm-field__input" name="resolution_timezone" type="text" placeholder="UTC" />
                  </label>

                  <label class="pm-checkbox">
                    <input name="neg_risk" type="checkbox" />
                    <span>Neg-risk market</span>
                  </label>

                  <label class="pm-checkbox">
                    <input name="featured" type="checkbox" />
                    <span>Featured</span>
                  </label>

                  <label class="pm-checkbox">
                    <input name="breaking" type="checkbox" />
                    <span>Breaking</span>
                  </label>

                  <label class="pm-checkbox">
                    <input name="searchable" type="checkbox" checked />
                    <span>Searchable</span>
                  </label>

                  <label class="pm-checkbox">
                    <input name="visible" type="checkbox" checked />
                    <span>Visible</span>
                  </label>

                  <label class="pm-checkbox pm-field--full">
                    <input name="hide_resolved_by_default" type="checkbox" />
                    <span>Hide resolved by default</span>
                  </label>

                  <label class="pm-checkbox pm-field--full">
                    <input name="publish_now" type="checkbox" />
                    <span>Publish immediately</span>
                  </label>
                </div>

                <div class="pm-market-actions">
                  <button class="pm-button pm-button--primary" type="submit" disabled={createMarketTask.pending()}>
                    {createMarketTask.pending() ? "Creating..." : "Create single binary market"}
                  </button>
                </div>

                <Show when={marketError()}>
                  {message => <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>}
                </Show>
              </form>

              <Show when={createMarketTask.data()}>
                {response => <CreatedMarketResult response={response()} />}
              </Show>
            </div>
          </Show>

          <Show when={props.type === "multi_market_event" || props.type === "sports_match_market"}>
            <div class="pm-admin-create-modal__panel">
              <Show when={!createdEventId()}>
                <section class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">
                      Continue existing event
                    </p>
                    <h3 class="pm-admin-create-modal__context-title">
                      {isSportsEventFlow()
                        ? "Resume sports event work"
                        : "Resume child-market work"}
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      {isSportsEventFlow()
                        ? "Reopen a draft or published sports event here, then continue with publishing or matchup updates without recreating the bundle."
                        : "Reopen a draft or published event here, then continue adding child markets or ladder markets without recreating the shell."}
                    </p>
                  </section>

                  <Show when={rememberedEvent()}>
                    {eventState => (
                      <section class="pm-admin-create-modal__resume">
                        <div class="pm-market-actions pm-market-actions--split">
                          <button
                            class="pm-button pm-button--primary"
                            type="button"
                            onClick={() =>
                              resumeEvent(
                                eventState().id,
                                eventState().slug,
                                eventState().publication_status,
                                getResumeStepForEvent(
                                  props.type,
                                  eventState().publication_status,
                                  eventState().matchup ?? null,
                                ),
                                eventState().matchup ?? null,
                              )
                            }
                          >
                            Continue {eventState().slug ?? "last active event"}
                          </button>

                          <button
                            class="pm-button pm-button--ghost"
                            type="button"
                            onClick={clearRememberedEvent}
                          >
                            Clear saved event
                          </button>
                        </div>

                        <p class="pm-market-feedback">
                          Saved admin event ID: {eventState().id}
                        </p>
                      </section>
                    )}
                  </Show>

                  <div class="pm-recovery-toolbar">
                    <div class="pm-filter-group">
                      <For each={(["draft", "published", "all"] as const)}>
                        {filter => (
                          <button
                            class={`pm-filter-group__button${
                              recoveryFilter() === filter ? " pm-filter-group__button--active" : ""
                            }`}
                            type="button"
                            onClick={() => {
                              setRecoveryFilter(filter);
                              void handleRefreshRecoveryList(filter);
                            }}
                          >
                            {filter}
                          </button>
                        )}
                      </For>
                    </div>

                    <button
                      class="pm-button pm-button--ghost"
                      type="button"
                      disabled={listEventsTask.pending()}
                      onClick={() => void handleRefreshRecoveryList()}
                    >
                      {listEventsTask.pending() ? "Refreshing..." : "Refresh events"}
                    </button>
                  </div>

                  <Show when={recoveryError()}>
                    {message => (
                      <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                    )}
                  </Show>

                  <Show
                    when={(listEventsTask.data()?.events.length ?? 0) > 0}
                    fallback={
                      <Show
                        when={!recoveryError()}
                        fallback={<p class="pm-market-feedback">Event recovery is unavailable.</p>}
                      >
                        <p class="pm-market-feedback">
                          {listEventsTask.pending()
                            ? "Loading admin events..."
                            : "No admin events matched this filter."}
                        </p>
                      </Show>
                    }
                  >
                    <div class="pm-recovery-list">
                      <For each={listEventsTask.data()?.events ?? []}>
                        {item => (
                          <button
                            class={`pm-recovery-card${
                              rememberedEvent()?.id === item.id ? " pm-recovery-card--active" : ""
                            }`}
                            type="button"
                            onClick={() =>
                              resumeEvent(
                                item.id,
                                item.slug,
                                item.publication_status,
                                getResumeStepForEvent(
                                  props.type,
                                  item.publication_status,
                                  item.matchup ?? null,
                                ),
                                item.matchup ?? null,
                              )
                            }
                          >
                            <div class="pm-recovery-card__header">
                              <div>
                                <p class="pm-market-card__eyebrow">{item.publication_status}</p>
                                <h3 class="pm-market-repeater__title">{item.slug}</h3>
                              </div>
                              <span class="pm-market-card__hint">{item.market_count} markets</span>
                            </div>

                            <p class="pm-recovery-card__meta">UUID: {item.id}</p>
                            <p class="pm-recovery-card__meta">
                              {item.title} • {item.category_slug}
                            </p>
                            <p class="pm-recovery-card__meta">
                              Created {formatTimestamp(item.created_at)}
                            </p>
                          </button>
                        )}
                      </For>
                    </div>
                  </Show>
                </section>
              </Show>

              <Show when={createdEventId()}>
                <div class="pm-admin-create-modal__subnav">
                  <Show when={isSportsEventFlow()}>
                    <button
                      class={`pm-filter-group__button${
                        multiMarketEventStep() === "match_bundle" ? " pm-filter-group__button--active" : ""
                      }`}
                      type="button"
                      onClick={() => setMultiMarketEventStep("match_bundle")}
                    >
                      Sports bundle
                    </button>
                  </Show>
                  <Show when={isGenericEventFlow()}>
                    <>
                      <button
                        class={`pm-filter-group__button${
                          multiMarketEventStep() === "event_shell" ? " pm-filter-group__button--active" : ""
                        }`}
                        type="button"
                        onClick={() => setMultiMarketEventStep("event_shell")}
                      >
                        Event shell
                      </button>
                      <button
                        class={`pm-filter-group__button${
                          multiMarketEventStep() === "manual_markets" ? " pm-filter-group__button--active" : ""
                        }`}
                        type="button"
                        onClick={() => setMultiMarketEventStep("manual_markets")}
                      >
                        Child markets
                      </button>
                      <button
                        class={`pm-filter-group__button${
                          multiMarketEventStep() === "ladder_markets" ? " pm-filter-group__button--active" : ""
                        }`}
                        type="button"
                        onClick={() => setMultiMarketEventStep("ladder_markets")}
                      >
                        Ladder markets
                      </button>
                    </>
                  </Show>
                  <button
                    class={`pm-filter-group__button${
                      multiMarketEventStep() === "publish_event" ? " pm-filter-group__button--active" : ""
                    }`}
                    type="button"
                    onClick={() => setMultiMarketEventStep("publish_event")}
                  >
                    Publish event
                  </button>
                  <button
                    class={`pm-filter-group__button${
                      multiMarketEventStep() === "publish_markets" ? " pm-filter-group__button--active" : ""
                    }`}
                    type="button"
                      onClick={() => setMultiMarketEventStep("publish_markets")}
                    >
                      Publish markets
                    </button>
                  <Show when={isSportsEventFlow()}>
                    <button
                      class={`pm-filter-group__button${
                        multiMarketEventStep() === "update_matchup" ? " pm-filter-group__button--active" : ""
                      }`}
                      type="button"
                      onClick={() => setMultiMarketEventStep("update_matchup")}
                    >
                      Update matchup
                    </button>
                  </Show>
                </div>
              </Show>

              <Show when={isSportsEventFlow() && multiMarketEventStep() === "match_bundle"}>
                <div class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">Sports match bundle</p>
                    <h3 class="pm-admin-create-modal__context-title">
                      One event card, many child markets
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      This mirrors the new backend flow at `/admin/events/matches`: create one
                      match event with structured matchup metadata plus catalog-driven sportsbook
                      templates in a single request.
                    </p>
                  </section>

                  <form class="pm-market-form" onSubmit={handleCreateMatchBundleSubmit}>
                    <div class="pm-market-fields">
                      <label class="pm-field">
                        <span class="pm-field__label">Title</span>
                        <input
                          class="pm-field__input"
                          name="title"
                          type="text"
                          placeholder="Australia vs Turkiye"
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Slug</span>
                        <input
                          class="pm-field__input"
                          name="slug"
                          type="text"
                          placeholder="australia-vs-turkiye-2026-05-27"
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Category slug</span>
                        <input
                          class="pm-field__input"
                          name="category_slug"
                          type="text"
                          value="sports"
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Subcategory slug</span>
                        <input
                          class="pm-field__input"
                          name="subcategory_slug"
                          type="text"
                          placeholder="soccer"
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Starts at</span>
                        <input class="pm-field__input" name="starts_at" type="datetime-local" required />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Market lock at</span>
                        <input
                          class="pm-field__input"
                          name="market_lock_at"
                          type="datetime-local"
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Sport slug</span>
                        <input
                          class="pm-field__input"
                          name="sport_slug"
                          type="text"
                          value={matchCatalogSportSlug()}
                          onInput={event => setMatchCatalogSportSlug(event.currentTarget.value)}
                          onChange={event =>
                            void handleRefreshMatchCatalog(event.currentTarget.value)
                          }
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Match status</span>
                        <select class="pm-field__input" name="match_status">
                          <option value="scheduled">Scheduled</option>
                          <option value="live">Live</option>
                          <option value="final">Final</option>
                          <option value="postponed">Postponed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="delayed">Delayed</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Competition</span>
                        <input
                          class="pm-field__input"
                          name="competition_name"
                          type="text"
                          placeholder="International Friendly"
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Round</span>
                        <input
                          class="pm-field__input"
                          name="round_name"
                          type="text"
                          placeholder="Matchday 1"
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Fixture ID</span>
                        <input
                          class="pm-field__input"
                          name="fixture_id"
                          type="text"
                          placeholder="api-fixture-id"
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Oracle address</span>
                        <input
                          class="pm-field__input"
                          name="oracle_address"
                          type="text"
                          placeholder="0x..."
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Group key</span>
                        <input
                          class="pm-field__input"
                          name="group_key"
                          type="text"
                          placeholder="optional custom group key"
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Series key</span>
                        <input
                          class="pm-field__input"
                          name="series_key"
                          type="text"
                          placeholder="optional custom series key"
                        />
                      </label>

                      <AdminImageUrlField name="image_url" scope="events" />

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Summary</span>
                        <textarea class="pm-field__textarea" name="summary" rows="3" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Tag slugs</span>
                        <textarea
                          class="pm-field__textarea"
                          name="tag_slugs"
                          rows="3"
                          placeholder={"international-friendly\nsoccer"}
                        />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Rules</span>
                        <textarea
                          class="pm-field__textarea"
                          name="rules"
                          rows="4"
                          placeholder="Resolve on regulation time only."
                          required
                        />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Context</span>
                        <textarea class="pm-field__textarea" name="context" rows="3" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Additional context</span>
                        <textarea class="pm-field__textarea" name="additional_context" rows="3" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Resolution sources</span>
                        <textarea
                          class="pm-field__textarea"
                          name="resolution_sources"
                          rows="3"
                          placeholder={"https://source.one\nhttps://source.two"}
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Resolution timezone</span>
                        <input class="pm-field__input" name="resolution_timezone" type="text" placeholder="UTC" />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Publish mode</span>
                        <select class="pm-field__input" name="publish_mode">
                          <option value="publish">Publish</option>
                          <option value="draft">Draft</option>
                          <option value="prepare">Prepare</option>
                        </select>
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Sort at</span>
                        <input class="pm-field__input" name="sort_at" type="datetime-local" />
                      </label>

                      <section class="pm-field pm-field--full">
                        <div class="pm-market-actions pm-market-actions--split">
                          <div>
                            <span class="pm-field__label">Match market templates</span>
                            <p class="pm-market-feedback">
                              Load the fixed catalog for this sport and choose which templates to
                              generate.
                            </p>
                          </div>

                          <button
                            class="pm-button pm-button--ghost"
                            type="button"
                            disabled={matchCatalogTask.pending()}
                            onClick={() => void handleRefreshMatchCatalog()}
                          >
                            {matchCatalogTask.pending() ? "Loading..." : "Refresh catalog"}
                          </button>
                        </div>

                        <Show when={matchCatalogError()}>
                          {message => (
                            <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                          )}
                        </Show>

                        <Show
                          when={matchTemplateDrafts().length > 0}
                          fallback={
                            <Show when={!matchCatalogTask.pending() && !matchCatalogError()}>
                              <p class="pm-market-feedback">
                                No match templates were returned for this sport yet.
                              </p>
                            </Show>
                          }
                        >
                          <div class="pm-market-repeater">
                            <For each={matchTemplateDrafts()}>
                              {template => (
                                <section class="pm-market-repeater__card">
                                  <div class="pm-market-repeater__header">
                                    <div>
                                      <p class="pm-market-card__eyebrow">{template.template_key}</p>
                                      <h3 class="pm-market-repeater__title">{template.label}</h3>
                                    </div>

                                    <label class="pm-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={template.selected}
                                        onChange={event =>
                                          updateMatchTemplateDraft(template.template_key, {
                                            selected: event.currentTarget.checked,
                                          })
                                        }
                                      />
                                      <span>Select</span>
                                    </label>
                                  </div>

                                  <p class="pm-market-feedback">{template.description}</p>
                                  <p class="pm-market-feedback">
                                    Generates:{" "}
                                    {template.generated_selections
                                      .map(selection => selection.label)
                                      .join(", ")}
                                  </p>

                                  <Show when={template.supports_lines}>
                                    <label class="pm-field pm-field--full">
                                      <span class="pm-field__label">Lines</span>
                                      <textarea
                                        class="pm-field__textarea"
                                        rows="3"
                                        value={template.lines}
                                        onInput={event =>
                                          updateMatchTemplateDraft(template.template_key, {
                                            lines: event.currentTarget.value,
                                          })
                                        }
                                      />
                                    </label>
                                  </Show>
                                </section>
                              )}
                            </For>
                          </div>
                        </Show>
                      </section>

                      <section class="pm-field pm-field--full">
                        <span class="pm-field__label">Home team</span>
                        <div class="pm-market-fields">
                          <label class="pm-field">
                            <span class="pm-field__label">Name</span>
                            <input class="pm-field__input" name="home_name" type="text" required />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Short name</span>
                            <input class="pm-field__input" name="home_short_name" type="text" />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Code</span>
                            <input class="pm-field__input" name="home_code" type="text" placeholder="aus" />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Score</span>
                            <input class="pm-field__input" name="home_score" type="number" min="0" step="1" />
                          </label>
                          <AdminImageUrlField name="home_image_url" scope="events" label="Home image URL" />
                        </div>
                      </section>

                      <section class="pm-field pm-field--full">
                        <span class="pm-field__label">Away team</span>
                        <div class="pm-market-fields">
                          <label class="pm-field">
                            <span class="pm-field__label">Name</span>
                            <input class="pm-field__input" name="away_name" type="text" required />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Short name</span>
                            <input class="pm-field__input" name="away_short_name" type="text" />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Code</span>
                            <input class="pm-field__input" name="away_code" type="text" placeholder="tur" />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Score</span>
                            <input class="pm-field__input" name="away_score" type="number" min="0" step="1" />
                          </label>
                          <AdminImageUrlField name="away_image_url" scope="events" label="Away image URL" />
                        </div>
                      </section>

                      <label class="pm-checkbox">
                        <input name="neg_risk" type="checkbox" />
                        <span>Neg-risk event</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="register_neg_risk" type="checkbox" />
                        <span>Register neg-risk after bundle creation</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="featured" type="checkbox" />
                        <span>Featured</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="breaking" type="checkbox" />
                        <span>Breaking</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="searchable" type="checkbox" checked />
                        <span>Searchable</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="visible" type="checkbox" checked />
                        <span>Visible</span>
                      </label>

                      <label class="pm-checkbox pm-field--full">
                        <input name="hide_resolved_by_default" type="checkbox" />
                        <span>Hide resolved by default</span>
                      </label>
                    </div>

                    <Show when={matchAdditionalMarketDrafts().length > 0}>
                      <div class="pm-market-repeater">
                        <For each={matchAdditionalMarketDrafts()}>
                          {(draft, index) => (
                            <section class="pm-market-repeater__card">
                              <div class="pm-market-repeater__header">
                                <div>
                                  <p class="pm-market-card__eyebrow">Custom market {index() + 1}</p>
                                  <h3 class="pm-market-repeater__title">
                                    {draft.label.trim() || `Custom market ${index() + 1}`}
                                  </h3>
                                </div>

                                <button
                                  class="pm-button pm-button--ghost"
                                  type="button"
                                  onClick={() => removeMatchAdditionalMarketDraft(draft.id)}
                                >
                                  Remove
                                </button>
                              </div>

                              <div class="pm-market-fields">
                                <label class="pm-field">
                                  <span class="pm-field__label">Label</span>
                                  <input
                                    class="pm-field__input"
                                    type="text"
                                    value={draft.label}
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "label",
                                        event.currentTarget.value,
                                      )
                                    }
                                    required
                                  />
                                </label>
                                <label class="pm-field">
                                  <span class="pm-field__label">Slug</span>
                                  <input
                                    class="pm-field__input"
                                    type="text"
                                    value={draft.slug}
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "slug",
                                        event.currentTarget.value,
                                      )
                                    }
                                    required
                                  />
                                </label>
                                <label class="pm-field pm-field--full">
                                  <span class="pm-field__label">Question</span>
                                  <textarea
                                    class="pm-field__textarea"
                                    rows="3"
                                    value={draft.question}
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "question",
                                        event.currentTarget.value,
                                      )
                                    }
                                    required
                                  />
                                </label>
                                <label class="pm-field">
                                  <span class="pm-field__label">End time</span>
                                  <input
                                    class="pm-field__input"
                                    type="datetime-local"
                                    value={draft.end_time}
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "end_time",
                                        event.currentTarget.value,
                                      )
                                    }
                                    required
                                  />
                                </label>
                                <label class="pm-field">
                                  <span class="pm-field__label">Oracle address</span>
                                  <input
                                    class="pm-field__input"
                                    type="text"
                                    value={draft.oracle_address}
                                    placeholder="0x..."
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "oracle_address",
                                        event.currentTarget.value,
                                      )
                                    }
                                    required
                                  />
                                </label>
                                <label class="pm-field">
                                  <span class="pm-field__label">Sort order</span>
                                  <input
                                    class="pm-field__input"
                                    type="number"
                                    step="1"
                                    value={draft.sort_order}
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "sort_order",
                                        event.currentTarget.value,
                                      )
                                    }
                                  />
                                </label>
                                <label class="pm-field pm-field--full">
                                  <span class="pm-field__label">Outcomes</span>
                                  <textarea
                                    class="pm-field__textarea"
                                    rows="3"
                                    value={draft.outcomes}
                                    onInput={event =>
                                      updateMatchAdditionalMarketDraft(
                                        draft.id,
                                        "outcomes",
                                        event.currentTarget.value,
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </section>
                          )}
                        </For>
                      </div>
                    </Show>

                    <div class="pm-market-actions pm-market-actions--split">
                      <button class="pm-button pm-button--ghost" type="button" onClick={addMatchAdditionalMarketDraft}>
                        Add custom child market
                      </button>

                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={createMatchBundleTask.pending()}
                      >
                        {createMatchBundleTask.pending() ? "Creating..." : "Create sports bundle"}
                      </button>
                    </div>

                    <Show when={matchBundleError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={createMatchBundleTask.data()}>
                    {response => (
                      <MatchBundleResult
                        response={response()}
                        eventId={createdEventId() || null}
                      />
                    )}
                  </Show>
                </div>
              </Show>

              <Show when={isGenericEventFlow() && multiMarketEventStep() === "event_shell"}>
                <div class="pm-admin-create-modal__panel">
                  <form class="pm-market-form" onSubmit={handleCreateEventSubmit}>
                    <div class="pm-market-fields">
                      <label class="pm-field">
                        <span class="pm-field__label">Title</span>
                        <input class="pm-field__input" name="title" type="text" required />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Slug</span>
                        <input class="pm-field__input" name="slug" type="text" required />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Category slug</span>
                        <input class="pm-field__input" name="category_slug" type="text" required />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Subcategory slug</span>
                        <input class="pm-field__input" name="subcategory_slug" type="text" />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Starts at</span>
                        <input class="pm-field__input" name="starts_at" type="datetime-local" />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Sort at</span>
                        <input class="pm-field__input" name="sort_at" type="datetime-local" />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Group key</span>
                        <input class="pm-field__input" name="group_key" type="text" required />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Series key</span>
                        <input class="pm-field__input" name="series_key" type="text" required />
                      </label>

                      <AdminImageUrlField name="image_url" scope="events" />

                      <label class="pm-checkbox">
                        <input name="neg_risk" type="checkbox" />
                        <span>Neg-risk event</span>
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Summary</span>
                        <textarea class="pm-field__textarea" name="summary" rows="3" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Tag slugs</span>
                        <textarea
                          class="pm-field__textarea"
                          name="tag_slugs"
                          rows="3"
                          placeholder={"crypto\nmacro"}
                        />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Context</span>
                        <textarea class="pm-field__textarea" name="context" rows="4" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Additional context</span>
                        <textarea class="pm-field__textarea" name="additional_context" rows="4" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Rules</span>
                        <textarea class="pm-field__textarea" name="rules" rows="5" required />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Resolution sources</span>
                        <textarea
                          class="pm-field__textarea"
                          name="resolution_sources"
                          rows="3"
                          placeholder={"https://source.one\nhttps://source.two"}
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Resolution timezone</span>
                        <input
                          class="pm-field__input"
                          name="resolution_timezone"
                          type="text"
                          placeholder="UTC"
                        />
                      </label>

                      <label class="pm-checkbox">
                        <input name="featured" type="checkbox" />
                        <span>Featured</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="breaking" type="checkbox" />
                        <span>Breaking</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="searchable" type="checkbox" checked />
                        <span>Searchable</span>
                      </label>

                      <label class="pm-checkbox">
                        <input name="visible" type="checkbox" checked />
                        <span>Visible</span>
                      </label>

                      <label class="pm-checkbox pm-field--full">
                        <input name="hide_resolved_by_default" type="checkbox" />
                        <span>Hide resolved by default</span>
                      </label>

                      <label class="pm-checkbox pm-field--full">
                        <input name="publish_now" type="checkbox" />
                        <span>Publish event immediately</span>
                      </label>
                    </div>

                    <div class="pm-market-actions">
                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={createEventTask.pending()}
                      >
                        {createEventTask.pending() ? "Creating..." : "Create event shell"}
                      </button>
                    </div>

                    <Show when={eventError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={createEventTask.data()}>
                    {response => (
                      <>
                        <CreatedEventResult response={response()} />
                        <section class="pm-admin-create-modal__followup">
                          <div>
                            <p class="pm-admin-create-modal__followup-label">
                              Continue with child markets
                            </p>
                            <h3 class="pm-admin-create-modal__followup-title">
                              {createdEventSlug() ?? response().event.slug}
                            </h3>
                            <p class="pm-admin-create-modal__followup-copy">
                              Event shell created. Add child markets manually or switch to ladder
                              generation using admin event ID `{createdEventId()}`.
                            </p>
                          </div>

                          <div class="pm-market-actions pm-market-actions--group">
                            <button
                              class="pm-button pm-button--primary"
                              type="button"
                              onClick={() => setMultiMarketEventStep("manual_markets")}
                            >
                              Add child markets
                            </button>
                            <button
                              class="pm-button pm-button--ghost"
                              type="button"
                              onClick={() => setMultiMarketEventStep("ladder_markets")}
                            >
                              Generate ladder markets
                            </button>
                          </div>
                        </section>
                      </>
                    )}
                  </Show>
                </div>
              </Show>

              <Show
                when={isGenericEventFlow() && multiMarketEventStep() === "manual_markets" && createdEventId()}
              >
                <div class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">Active event</p>
                    <h3 class="pm-admin-create-modal__context-title">
                      {createdEventSlug() ?? "Event selected"}
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      Add child markets here. They will be attached to admin event ID
                      ` {createdEventId()} `. Use the Event shell tab if you need to review the
                      creation response again.
                    </p>

                    <div class="pm-market-actions pm-market-actions--group">
                      <span class="pm-market-chip">
                        {createdEventPublicationStatus() ?? "draft"}
                      </span>

                      <Show when={!eventIsPublished()}>
                        <button
                          class="pm-button pm-button--ghost"
                          type="button"
                          onClick={() => setMultiMarketEventStep("publish_event")}
                        >
                          Publish event shell first
                        </button>
                      </Show>

                      <Show when={eventIsPublished()}>
                        <button
                          class="pm-button pm-button--ghost"
                          type="button"
                          onClick={() => setMultiMarketEventStep("publish_markets")}
                        >
                          Go to publish markets
                        </button>
                      </Show>
                    </div>
                  </section>

                  <form class="pm-market-form" onSubmit={handleCreateEventMarketsSubmit}>
                    <div class="pm-market-repeater">
                      <For each={eventMarketsDrafts()}>
                        {(draft, index) => (
                          <section class="pm-market-repeater__card">
                            <div class="pm-market-repeater__header">
                              <div>
                                <p class="pm-market-card__eyebrow">Market {index() + 1}</p>
                                <h3 class="pm-market-repeater__title">
                                  {draft.label.trim() || `Untitled market ${index() + 1}`}
                                </h3>
                              </div>

                              <button
                                class="pm-button pm-button--ghost"
                                type="button"
                                disabled={eventMarketsDrafts().length === 1}
                                onClick={() =>
                                  setEventMarketsDrafts(current =>
                                    current.length === 1
                                      ? current
                                      : current.filter(item => item.id !== draft.id),
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>

                            <div class="pm-market-fields">
                              <label class="pm-field">
                                <span class="pm-field__label">Label</span>
                                <input
                                  class="pm-field__input"
                                  type="text"
                                  value={draft.label}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, label: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  required
                                />
                              </label>

                              <label class="pm-field">
                                <span class="pm-field__label">Slug</span>
                                <input
                                  class="pm-field__input"
                                  type="text"
                                  value={draft.slug}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, slug: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  required
                                />
                              </label>

                              <label class="pm-field pm-field--full">
                                <span class="pm-field__label">Question</span>
                                <textarea
                                  class="pm-field__textarea"
                                  rows="3"
                                  value={draft.question}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, question: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  required
                                />
                              </label>

                              <label class="pm-field">
                                <span class="pm-field__label">End time</span>
                                <input
                                  class="pm-field__input"
                                  type="datetime-local"
                                  value={draft.end_time}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, end_time: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  required
                                />
                              </label>

                              <label class="pm-field">
                                <span class="pm-field__label">Oracle address</span>
                                <input
                                  class="pm-field__input"
                                  type="text"
                                  placeholder="0x..."
                                  value={draft.oracle_address}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, oracle_address: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  required
                                />
                              </label>

                              <label class="pm-field">
                                <span class="pm-field__label">Sort order</span>
                                <input
                                  class="pm-field__input"
                                  type="number"
                                  step="1"
                                  placeholder={`${index() + 1}`}
                                  value={draft.sort_order}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, sort_order: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                />
                              </label>

                              <label class="pm-field pm-field--full">
                                <span class="pm-field__label">Outcomes</span>
                                <textarea
                                  class="pm-field__textarea"
                                  rows="3"
                                  value={draft.outcomes}
                                  onInput={event =>
                                    setEventMarketsDrafts(current =>
                                      current.map(item =>
                                        item.id === draft.id
                                          ? { ...item, outcomes: event.currentTarget.value }
                                          : item,
                                      ),
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </section>
                        )}
                      </For>
                    </div>

                    <div class="pm-market-actions pm-market-actions--split">
                      <button
                        class="pm-button pm-button--ghost"
                        type="button"
                        onClick={() =>
                          setEventMarketsDrafts(current => [...current, createEventMarketDraft()])
                        }
                      >
                        Add another market
                      </button>

                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={createEventMarketsTask.pending()}
                      >
                        {createEventMarketsTask.pending() ? "Creating..." : "Add child markets"}
                      </button>
                    </div>

                    <label class="pm-checkbox">
                      <input
                        type="checkbox"
                        checked={publishChildMarketsNow()}
                        disabled={!eventIsPublished()}
                        onChange={event => setPublishChildMarketsNow(event.currentTarget.checked)}
                      />
                      <span>Publish these child markets immediately</span>
                    </label>

                    <Show when={!eventIsPublished()}>
                      <p class="pm-market-feedback">
                        The event shell is still draft. Publish the event first, then come back if
                        you want create + publish in one request.
                      </p>
                    </Show>

                    <Show when={eventMarketsError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={createEventMarketsTask.data()}>
                    {response => <ChildMarketsResult response={response()} />}
                  </Show>
                </div>
              </Show>

              <Show
                when={isGenericEventFlow() && multiMarketEventStep() === "ladder_markets" && createdEventId()}
              >
                <div class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">Active event</p>
                    <h3 class="pm-admin-create-modal__context-title">
                      {createdEventSlug() ?? "Event selected"}
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      Ladder markets created here will be attached to admin event ID
                      ` {createdEventId()} `.
                    </p>

                    <div class="pm-market-actions pm-market-actions--group">
                      <span class="pm-market-chip">
                        {createdEventPublicationStatus() ?? "draft"}
                      </span>

                      <Show when={!eventIsPublished()}>
                        <button
                          class="pm-button pm-button--ghost"
                          type="button"
                          onClick={() => setMultiMarketEventStep("publish_event")}
                        >
                          Publish event shell first
                        </button>
                      </Show>

                      <Show when={eventIsPublished()}>
                        <button
                          class="pm-button pm-button--ghost"
                          type="button"
                          onClick={() => setMultiMarketEventStep("publish_markets")}
                        >
                          Go to publish markets
                        </button>
                      </Show>
                    </div>
                  </section>

                  <form class="pm-market-form" onSubmit={handleCreateLadderSubmit}>
                    <div class="pm-market-fields">
                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Event ID</span>
                        <input
                          class="pm-field__input"
                          name="event_id"
                          type="text"
                          value={createdEventId()}
                          readOnly
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Underlying</span>
                        <input
                          class="pm-field__input"
                          name="underlying"
                          type="text"
                          placeholder="BTC"
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Deadline label</span>
                        <input
                          class="pm-field__input"
                          name="deadline_label"
                          type="text"
                          placeholder="April 10 close"
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">End time</span>
                        <input class="pm-field__input" name="end_time" type="datetime-local" required />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Oracle address</span>
                        <input
                          class="pm-field__input"
                          name="oracle_address"
                          type="text"
                          placeholder="0x..."
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Unit symbol</span>
                        <input class="pm-field__input" name="unit_symbol" type="text" placeholder="$" />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Up thresholds</span>
                        <textarea
                          class="pm-field__textarea"
                          name="up_thresholds"
                          rows="4"
                          placeholder={"85000\n90000"}
                        />
                      </label>

                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Down thresholds</span>
                        <textarea
                          class="pm-field__textarea"
                          name="down_thresholds"
                          rows="4"
                          placeholder={"75000\n70000"}
                        />
                      </label>

                      <p class="pm-market-feedback pm-field--full">
                        The backend generates sequential sort order, uses Yes/No outcomes, and builds
                        labels from the threshold lists.
                      </p>

                      <label class="pm-checkbox pm-field--full">
                        <input name="publish_now" type="checkbox" disabled={!eventIsPublished()} />
                        <span>Publish these ladder markets immediately</span>
                      </label>

                      <Show when={!eventIsPublished()}>
                        <p class="pm-market-feedback pm-field--full">
                          The event shell is still draft. Publish the event first, then return here
                          if you want generation + publish in one request.
                        </p>
                      </Show>
                    </div>

                    <div class="pm-market-actions">
                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={createLadderTask.pending()}
                      >
                        {createLadderTask.pending() ? "Generating..." : "Generate ladder markets"}
                      </button>
                    </div>

                    <Show when={ladderError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={createLadderTask.data()}>
                    {response => <LadderResult response={response()} />}
                  </Show>
                </div>
              </Show>

              <Show when={multiMarketEventStep() === "publish_event" && createdEventId()}>
                <div class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">Publish event shell</p>
                    <h3 class="pm-admin-create-modal__context-title">
                      {createdEventSlug() ?? "Event selected"}
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      Publish the parent event first. After that, draft child markets can be batch
                      published in the next step.
                    </p>
                  </section>

                  <form class="pm-market-form" onSubmit={handlePublishEventSubmit}>
                    <div class="pm-market-fields">
                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Event ID</span>
                        <input
                          class="pm-field__input"
                          name="event_id"
                          type="text"
                          value={createdEventId()}
                          readOnly
                          required
                        />
                      </label>
                    </div>

                    <div class="pm-market-actions pm-market-actions--split">
                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={publishEventTask.pending()}
                      >
                        {publishEventTask.pending() ? "Publishing..." : "Publish event shell"}
                      </button>

                      <button
                        class="pm-button pm-button--ghost"
                        type="button"
                        onClick={() => setMultiMarketEventStep("publish_markets")}
                      >
                        Go to publish markets
                      </button>
                    </div>

                    <Show when={publishEventError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={publishEventTask.data()}>
                    {response => <PublishedEventResult response={response()} />}
                  </Show>
                </div>
              </Show>

              <Show when={multiMarketEventStep() === "publish_markets" && createdEventId()}>
                <div class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">Publish child markets</p>
                    <h3 class="pm-admin-create-modal__context-title">
                      {createdEventSlug() ?? "Event selected"}
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      Batch publish all draft child markets under this event and fill their
                      condition IDs. The parent event must already be published.
                    </p>
                  </section>

                  <Show when={!eventIsPublished()}>
                    <p class="pm-market-feedback">
                      This event is still draft. Publish the event shell first, then return here to
                      publish the child markets.
                    </p>
                  </Show>

                  <form class="pm-market-form" onSubmit={handlePublishEventMarketsSubmit}>
                    <div class="pm-market-fields">
                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Event ID</span>
                        <input
                          class="pm-field__input"
                          name="event_id"
                          type="text"
                          value={createdEventId()}
                          readOnly
                          required
                        />
                      </label>
                    </div>

                    <div class="pm-market-actions pm-market-actions--split">
                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={publishEventMarketsTask.pending() || !eventIsPublished()}
                      >
                        {publishEventMarketsTask.pending()
                          ? "Publishing..."
                          : "Publish child markets"}
                      </button>

                      <button
                        class="pm-button pm-button--ghost"
                        type="button"
                        onClick={() => setMultiMarketEventStep("manual_markets")}
                      >
                        Back to child markets
                      </button>
                    </div>

                    <Show when={publishEventMarketsError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={publishEventMarketsTask.data()}>
                    {response => <PublishedChildMarketsResult response={response()} />}
                  </Show>
                </div>
              </Show>

              <Show when={isSportsEventFlow() && multiMarketEventStep() === "update_matchup" && createdEventId()}>
                <div class="pm-admin-create-modal__panel">
                  <section class="pm-admin-create-modal__context">
                    <p class="pm-admin-create-modal__context-label">Live score and status sync</p>
                    <h3 class="pm-admin-create-modal__context-title">
                      {createdEventSlug() ?? "Event selected"}
                    </h3>
                    <p class="pm-admin-create-modal__context-copy">
                      This sends the full matchup object to `/admin/events/{'{event_id}'}/matchup`.
                      Update both sides, scores, codes, images, and status together so public game
                      cards stay consistent.
                    </p>
                  </section>

                  <form class="pm-market-form" onSubmit={handleUpdateEventMatchupSubmit}>
                    <div class="pm-market-fields">
                      <label class="pm-field pm-field--full">
                        <span class="pm-field__label">Event ID</span>
                        <input class="pm-field__input" name="event_id" type="text" value={createdEventId()} readOnly />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Sport slug</span>
                        <input
                          class="pm-field__input"
                          name="sport_slug"
                          type="text"
                          value={activeEventMatchup()?.sport_slug ?? "soccer"}
                          required
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Match status</span>
                        <select
                          class="pm-field__input"
                          name="match_status"
                          value={activeEventMatchup()?.status ?? "scheduled"}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="live">Live</option>
                          <option value="final">Final</option>
                          <option value="postponed">Postponed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="delayed">Delayed</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Competition</span>
                        <input
                          class="pm-field__input"
                          name="competition_name"
                          type="text"
                          value={activeEventMatchup()?.competition_name ?? ""}
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Round</span>
                        <input
                          class="pm-field__input"
                          name="round_name"
                          type="text"
                          value={activeEventMatchup()?.round_name ?? ""}
                        />
                      </label>

                      <label class="pm-field">
                        <span class="pm-field__label">Fixture ID</span>
                        <input
                          class="pm-field__input"
                          name="fixture_id"
                          type="text"
                          value={activeEventMatchup()?.fixture_id ?? ""}
                        />
                      </label>

                      <section class="pm-field pm-field--full">
                        <span class="pm-field__label">Home team</span>
                        <div class="pm-market-fields">
                          <label class="pm-field">
                            <span class="pm-field__label">Name</span>
                            <input
                              class="pm-field__input"
                              name="home_name"
                              type="text"
                              value={activeEventMatchup()?.home.name ?? ""}
                              required
                            />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Short name</span>
                            <input
                              class="pm-field__input"
                              name="home_short_name"
                              type="text"
                              value={activeEventMatchup()?.home.short_name ?? ""}
                            />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Code</span>
                            <input
                              class="pm-field__input"
                              name="home_code"
                              type="text"
                              value={activeEventMatchup()?.home.code ?? ""}
                            />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Score</span>
                            <input
                              class="pm-field__input"
                              name="home_score"
                              type="number"
                              min="0"
                              step="1"
                              value={activeEventMatchup()?.home.score ?? ""}
                            />
                          </label>
                          <AdminImageUrlField
                            name="home_image_url"
                            scope="events"
                            label="Home image URL"
                            value={activeEventMatchup()?.home.image_url ?? ""}
                          />
                        </div>
                      </section>

                      <section class="pm-field pm-field--full">
                        <span class="pm-field__label">Away team</span>
                        <div class="pm-market-fields">
                          <label class="pm-field">
                            <span class="pm-field__label">Name</span>
                            <input
                              class="pm-field__input"
                              name="away_name"
                              type="text"
                              value={activeEventMatchup()?.away.name ?? ""}
                              required
                            />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Short name</span>
                            <input
                              class="pm-field__input"
                              name="away_short_name"
                              type="text"
                              value={activeEventMatchup()?.away.short_name ?? ""}
                            />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Code</span>
                            <input
                              class="pm-field__input"
                              name="away_code"
                              type="text"
                              value={activeEventMatchup()?.away.code ?? ""}
                            />
                          </label>
                          <label class="pm-field">
                            <span class="pm-field__label">Score</span>
                            <input
                              class="pm-field__input"
                              name="away_score"
                              type="number"
                              min="0"
                              step="1"
                              value={activeEventMatchup()?.away.score ?? ""}
                            />
                          </label>
                          <AdminImageUrlField
                            name="away_image_url"
                            scope="events"
                            label="Away image URL"
                            value={activeEventMatchup()?.away.image_url ?? ""}
                          />
                        </div>
                      </section>
                    </div>

                    <div class="pm-market-actions">
                      <button
                        class="pm-button pm-button--primary"
                        type="submit"
                        disabled={updateEventMatchupTask.pending()}
                      >
                        {updateEventMatchupTask.pending() ? "Updating..." : "Update matchup"}
                      </button>
                    </div>

                    <Show when={updateMatchupError()}>
                      {message => (
                        <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>
                      )}
                    </Show>
                  </form>

                  <Show when={updateEventMatchupTask.data()}>
                    {response => <UpdatedMatchupResult response={response()} />}
                  </Show>
                </div>
              </Show>
            </div>
          </Show>

          <Show when={props.type === "ladder_market"}>
            <div class="pm-admin-create-modal__panel">
              <form class="pm-market-form" onSubmit={handleCreateLadderSubmit}>
                <div class="pm-market-fields">
                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Event ID</span>
                    <input class="pm-field__input" name="event_id" type="text" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Underlying</span>
                    <input class="pm-field__input" name="underlying" type="text" placeholder="BTC" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Deadline label</span>
                    <input class="pm-field__input" name="deadline_label" type="text" placeholder="April 10 close" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">End time</span>
                    <input class="pm-field__input" name="end_time" type="datetime-local" required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Oracle address</span>
                    <input class="pm-field__input" name="oracle_address" type="text" placeholder="0x..." required />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Unit symbol</span>
                    <input class="pm-field__input" name="unit_symbol" type="text" placeholder="$" />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Up thresholds</span>
                    <textarea class="pm-field__textarea" name="up_thresholds" rows="4" placeholder={"85000\n90000"} />
                  </label>

                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Down thresholds</span>
                    <textarea class="pm-field__textarea" name="down_thresholds" rows="4" placeholder={"75000\n70000"} />
                  </label>

                  <p class="pm-market-feedback pm-field--full">
                    The event shell must already exist. Use the multi-market event flow first if you
                    still need an admin event ID.
                  </p>

                  <p class="pm-market-feedback pm-field--full">
                    The backend generates sequential sort order, uses Yes/No outcomes, and builds
                    labels from the threshold lists.
                  </p>

                  <label class="pm-checkbox pm-field--full">
                    <input name="publish_now" type="checkbox" />
                    <span>Publish these ladder markets immediately</span>
                  </label>
                </div>

                <div class="pm-market-actions">
                  <button class="pm-button pm-button--primary" type="submit" disabled={createLadderTask.pending()}>
                    {createLadderTask.pending() ? "Generating..." : "Generate ladder markets"}
                  </button>
                </div>

                <Show when={ladderError()}>
                  {message => <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>}
                </Show>
              </form>

              <Show when={createLadderTask.data()}>
                {response => <LadderResult response={response()} />}
              </Show>
            </div>
          </Show>
        </div>
      </section>
    </>
  );
}
