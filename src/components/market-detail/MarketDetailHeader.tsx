import { For, Show } from "solid-js";

import { normalizeOptionalMediaUrl } from "~/lib/media";
import {
  formatMatchScore,
  formatMatchStatusLabel,
  formatMatchupMetaLine,
  getMatchParticipantCode,
  getMatchParticipantLabel,
} from "~/lib/market/matchup.ts";
import type { EventDetailViewModel } from "./types.ts";
import { BookmarkIcon, LinkIcon, ShareIcon } from "./icons.tsx";

interface MarketDetailHeaderProps {
  adminActionError?: string | null;
  adminEventActionPending?: boolean;
  canAddMarketToEvent?: boolean;
  data: EventDetailViewModel;
  onAddMarketToEvent?: () => void;
  onBootstrapEventLiquidity?: () => void;
  onEditSelectedMarket?: () => void;
  onSelectMarket: (marketSlug: string) => void;
}

function MatchParticipantBadge(props: {
  name: string;
  code: string | null;
  imageUrl: string | null | undefined;
}) {
  const imageUrl = () => normalizeOptionalMediaUrl(props.imageUrl);

  return (
    <div class="pm-match-badge" aria-hidden="true">
      <Show
        when={imageUrl()}
        fallback={
          <span class="pm-match-badge__fallback">
            {props.code ?? props.name.slice(0, 3).toUpperCase()}
          </span>
        }
      >
        <img src={imageUrl() ?? ""} alt="" loading="lazy" decoding="async" />
      </Show>
    </div>
  );
}

export default function MarketDetailHeader(props: MarketDetailHeaderProps) {
  const fallbackLetter = () => props.data.eventTitle.trim().charAt(0).toUpperCase() || "M";
  const matchup = () => props.data.eventMatchup;
  const matchupMeta = () => formatMatchupMetaLine(matchup(), props.data.eventStartsAt);
  const matchupScore = () => formatMatchScore(matchup());
  const eventImageUrl = () => normalizeOptionalMediaUrl(props.data.eventImageUrl);

  return (
    <div class="pm-event-header">
      <div class="pm-event-header__bar">
        <div class="pm-event-header__copy">
          <div class="pm-event-header__art">
            <Show
              when={matchup()}
              fallback={
                <Show
                  when={eventImageUrl()}
                  fallback={<span class="pm-event-header__art-fallback">{fallbackLetter()}</span>}
                >
                  {value => (
                    <img
                      src={value() ?? ""}
                      alt={`${props.data.eventTitle} icon`}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </Show>
              }
            >
              {value => (
                <div class="pm-match-art">
                  <MatchParticipantBadge
                    name={getMatchParticipantLabel(value().home)}
                    code={getMatchParticipantCode(value().home)}
                    imageUrl={value().home.image_url}
                  />
                  <MatchParticipantBadge
                    name={getMatchParticipantLabel(value().away)}
                    code={getMatchParticipantCode(value().away)}
                    imageUrl={value().away.image_url}
                  />
                </div>
              )}
            </Show>
          </div>

          <div class="pm-event-header__text">
            <p class="pm-event-header__kicker">
              {props.data.categoryLabel}
              <Show when={props.data.subcategoryLabel}>
                <span> · {props.data.subcategoryLabel}</span>
              </Show>
            </p>
            <Show
              when={matchup()}
              fallback={
                <>
                  <h1 class="pm-event-header__title">{props.data.eventTitle}</h1>
                  <p class="pm-event-header__meta">
                    {props.data.marketCount} markets · {props.data.selectedMarket.headerMeta}
                  </p>
                </>
              }
            >
              {value => (
                <>
                  <div class="pm-event-header__match-status">
                    <span class="pm-event-header__match-pill">
                      {formatMatchStatusLabel(value().status)}
                    </span>
                    <Show when={matchupMeta()}>
                      {meta => <span class="pm-event-header__meta">{meta()}</span>}
                    </Show>
                  </div>
                  <h1 class="pm-event-header__title pm-event-header__title--matchup">
                    <span>{getMatchParticipantLabel(value().home)}</span>
                    <span class="pm-event-header__match-score">{matchupScore() ?? "vs"}</span>
                    <span>{getMatchParticipantLabel(value().away)}</span>
                  </h1>
                  <p class="pm-event-header__meta">
                    {props.data.marketCount} markets · {props.data.selectedMarket.headerMeta}
                  </p>
                </>
              )}
            </Show>
          </div>
        </div>

        <div class="pm-event-header__actions" aria-label="Event actions">
          <Show when={props.canAddMarketToEvent}>
            <button
              type="button"
              class="pm-button pm-button--ghost pm-event-header__admin-action"
              onClick={() => props.onEditSelectedMarket?.()}
            >
              Edit selected market
            </button>

            <button
              type="button"
              class="pm-button pm-button--ghost pm-event-header__admin-action"
              disabled={props.adminEventActionPending}
              onClick={() => props.onBootstrapEventLiquidity?.()}
            >
              {props.adminEventActionPending ? "Opening..." : "Bootstrap event"}
            </button>

            <button
              type="button"
              class="pm-button pm-button--ghost pm-event-header__admin-action"
              disabled={props.adminEventActionPending}
              onClick={() => props.onAddMarketToEvent?.()}
            >
              {props.adminEventActionPending ? "Opening..." : "Add market to event"}
            </button>
          </Show>

          <button type="button" class="pm-event-icon-button" aria-label="Share market">
            <ShareIcon />
          </button>
          <button type="button" class="pm-event-icon-button" aria-label="Copy market link">
            <LinkIcon />
          </button>
          <button type="button" class="pm-event-icon-button" aria-label="Add to favorites">
            <BookmarkIcon />
          </button>
        </div>
      </div>

      <div class="pm-event-header__tabs" role="tablist" aria-label="Markets in this event">
        <For each={props.data.marketTabs}>
          {tab => (
            <button
              type="button"
              classList={{
                "pm-event-header__tab": true,
                "pm-event-header__tab--active": tab.isSelected,
              }}
              onClick={() => props.onSelectMarket(tab.marketSlug)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>

      <Show when={props.adminActionError}>
        {message => <p class="pm-event-header__admin-feedback">{message()}</p>}
      </Show>
    </div>
  );
}
