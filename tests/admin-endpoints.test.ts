import assert from "node:assert/strict";
import test, { afterEach } from "node:test";

import { ApiError } from "~/lib/api/core";
import {
  bootstrapAdminEventLiquidity,
  bootstrapAdminMarketLiquidity,
  connectAdminWallet,
  createAdminEvent,
  createAdminEventMarketLadder,
  createAdminEventMarkets,
  createAdminMatchEventBundle,
  createAdminMarket,
  disputeAdminMarketResolution,
  emergencyResolveAdminMarket,
  finalizeAdminMarketResolution,
  getAdminEvent,
  getAdminEventMarkets,
  getAdminMatchMarketCatalog,
  listAdminEvents,
  getAdminMe,
  pauseAdminMarket,
  publishAdminEventMarkets,
  publishAdminEventShell,
  proposeAdminMarketResolution,
  registerAdminNegRiskEvent,
  requestAdminWalletChallenge,
  setAdminMarketPrices,
  updateAdminEventMatchup,
  unpauseAdminMarket,
  updateAdminMarket,
  uploadAdminImage,
} from "~/lib/api/admin";
import { formatMatchScore } from "~/lib/market/matchup";
import { getUsdcFaucetBalance, requestUsdcFaucet } from "~/lib/api/faucet";
import { parseUsdcDollarsToBaseUnits } from "~/lib/usdc";

type MockResponseInit = {
  payload?: unknown;
  status?: number;
  headers?: HeadersInit;
};

type RecordedFetchCall = {
  input: RequestInfo | URL;
  init: RequestInit | undefined;
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("parseUsdcDollarsToBaseUnits converts whole-dollar USDC inputs to base units", () => {
  assert.equal(parseUsdcDollarsToBaseUnits("1500", "Inventory USDC amount"), "1500000000");
});

test("parseUsdcDollarsToBaseUnits supports decimals, commas, and a dollar sign", () => {
  assert.equal(
    parseUsdcDollarsToBaseUnits("$1,500.25", "Inventory USDC amount"),
    "1500250000",
  );
});

test("parseUsdcDollarsToBaseUnits rejects more than 6 decimals", () => {
  assert.throws(
    () => parseUsdcDollarsToBaseUnits("1.0000001", "Inventory USDC amount"),
    /up to 6 decimal places/,
  );
});

test("parseUsdcDollarsToBaseUnits allows zero only when explicitly requested", () => {
  assert.throws(
    () => parseUsdcDollarsToBaseUnits("0", "Exit collateral USDC amount"),
    /must be greater than zero/,
  );
  assert.equal(
    parseUsdcDollarsToBaseUnits("0", "Exit collateral USDC amount", { allowZero: true }),
    "0",
  );
});

test("formatMatchScore hides default scheduled 0-0 but keeps live 0-0", () => {
  assert.equal(
    formatMatchScore({
      sport_slug: "soccer",
      status: "scheduled",
      home: { name: "Australia", score: 0 },
      away: { name: "Turkiye", score: 0 },
    }),
    null,
  );

  assert.equal(
    formatMatchScore({
      sport_slug: "soccer",
      status: "live",
      home: { name: "Australia", score: 0 },
      away: { name: "Turkiye", score: 0 },
    }),
    "0 - 0",
  );
});

test("requestAdminWalletChallenge posts the wallet challenge payload", async () => {
  const calls = installFetchMock({
    payload: {
      challenge_id: "challenge-id",
      message: "Sign this message",
      expires_at: "2026-04-02T12:00:00Z",
    },
  });

  const response = await requestAdminWalletChallenge({
    wallet_address: "0xabc123",
  });

  assert.equal(response.challenge_id, "challenge-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/auth/wallet/challenge",
    body: {
      wallet_address: "0xabc123",
    },
  });
});

test("connectAdminWallet posts the signed challenge payload", async () => {
  const calls = installFetchMock({
    payload: {
      token: "jwt-token",
      user: buildUser(),
    },
  });

  const response = await connectAdminWallet({
    challenge_id: "challenge-id",
    signature: "0xsigned",
    username: "admin",
  });

  assert.equal(response.token, "jwt-token");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/auth/wallet/connect",
    body: {
      challenge_id: "challenge-id",
      signature: "0xsigned",
      username: "admin",
    },
  });
});

test("getAdminMe sends the auth header", async () => {
  const calls = installFetchMock({
    payload: {
      user: buildUser(),
      xlayer_chain_id: 1952,
    },
  });

  const response = await getAdminMe("jwt-token");

  assert.equal(response.xlayer_chain_id, 1952);
  assertJsonRequest(calls[0], {
    method: "GET",
    path: "/admin/me",
    token: "jwt-token",
  });
});

test("requestUsdcFaucet posts the faucet payload", async () => {
  const calls = installFetchMock({
    payload: {
      token_address: "0xusdc",
      recipient: "0xabc123",
      amount: "150000000",
      tx_hash: "0xtxhash",
      requested_at: "2026-04-02T12:00:00Z",
    },
  });

  const response = await requestUsdcFaucet({
    address: "0xabc123",
    amount: "150000000",
  });

  assert.equal(response.tx_hash, "0xtxhash");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/faucet/usdc",
    body: {
      address: "0xabc123",
      amount: "150000000",
    },
  });
});

test("getUsdcFaucetBalance sends the faucet balance query", async () => {
  const calls = installFetchMock({
    payload: {
      token_address: "0xusdc",
      address: "0xabc123",
      balance: "250000000",
      queried_at: "2026-04-02T12:00:00Z",
    },
  });

  const response = await getUsdcFaucetBalance("0xabc123");

  assert.equal(response.balance, "250000000");
  assert.equal(readRequestPath(calls[0]), "/faucet/usdc/balance");
  assert.equal(readRequestUrl(calls[0]).searchParams.get("address"), "0xabc123");
  assert.equal(calls[0].init?.method, "GET");
});

test("getAdminMe throws ApiError when the backend rejects the request", async () => {
  installFetchMock({
    payload: {
      error: "admin access required",
    },
    status: 403,
  });

  await assert.rejects(() => getAdminMe("jwt-token"), error => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 403);
    assert.equal(error.message, "admin access required");
    return true;
  });
});

test("uploadAdminImage sends multipart form data to the upload endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      asset: {
        id: "asset-id",
        storage_provider: "filebase_ipfs",
        bucket_name: "bucket",
        scope: "markets",
        file_name: "asset.png",
        content_type: "image/png",
        size_bytes: 4,
        cid: "cid",
        ipfs_url: "ipfs://cid",
        gateway_url: "https://gateway/cid",
        created_at: "2026-04-02T12:00:00Z",
      },
    },
  });

  const file = new File(["test"], "market.png", { type: "image/png" });
  const response = await uploadAdminImage({
    file,
    token: "jwt-token",
    scope: "markets",
  });

  assert.equal(response.asset.id, "asset-id");
  assert.equal(calls[0].init?.method, "POST");
  assert.equal(readRequestPath(calls[0]), "/admin/uploads/images");
  assert.equal(readAuthorizationHeader(calls[0].init), "Bearer jwt-token");

  const body = calls[0].init?.body;
  assert.ok(body instanceof FormData);
  assert.equal(body.get("scope"), "markets");
  assert.equal((body.get("file") as File).name, "market.png");
});

test("createAdminEvent posts the event draft payload", async () => {
  const calls = installFetchMock({
    payload: {
      id: "event-id",
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      created_at: "2026-04-02T12:00:00Z",
    },
  });

  const payload = {
    event: {
      title: "Election 2028",
      slug: "election-2028",
      category_slug: "politics",
      rules: "Rules",
    },
    chain: {
      group_key: "group",
      series_key: "series",
    },
  };

  const response = await createAdminEvent(payload, { token: "jwt-token" });

  assert.equal(response.id, "event-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events",
    body: payload,
    token: "jwt-token",
  });
});

test("createAdminMatchEventBundle posts the sports bundle payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        publication_status: "published",
        matchup: buildMatchup(),
      },
      on_chain: buildEventOnChain(),
      markets: [buildMarket()],
    },
  });

  const payload = {
    event: {
      title: "Australia vs Turkiye",
      slug: "australia-vs-turkiye-2026-05-27",
      category_slug: "sports",
      subcategory_slug: "soccer",
      rules: "Resolve on regulation time only.",
      starts_at: "2026-05-28T04:00:00Z",
      matchup: buildMatchup(),
    },
    chain: {
      neg_risk: true,
    },
    markets: {
      oracle_address: "0xoracle",
      template_selections: [
        {
          template_key: "match_result_3_way",
        },
        {
          template_key: "both_teams_to_score",
        },
        {
          template_key: "total_goals_over",
          lines: ["1.5", "2.5", "3.5"],
        },
      ],
      register_neg_risk: true,
    },
    publish: {
      mode: "publish" as const,
    },
  };

  const response = await createAdminMatchEventBundle(payload, { token: "jwt-token" });

  assert.equal(response.event.slug, "event");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/matches",
    body: payload,
    token: "jwt-token",
  });
});

test("getAdminMatchMarketCatalog reads the sports template catalog", async () => {
  const calls = installFetchMock({
    payload: {
      sport_slug: "soccer",
      templates: [
        {
          template_key: "match_result_3_way",
          market_key: "h2h_3_way",
          label: "Match Result (3-Way)",
          description: "Creates Home Win, Draw, and Away Win contracts for regulation time.",
          period_key: "regulation",
          supports_lines: false,
          default_selected: true,
          default_lines: [],
          generated_selections: [
            { selection_key: "home", label: "Home Win" },
            { selection_key: "draw", label: "Draw" },
            { selection_key: "away", label: "Away Win" },
          ],
        },
      ],
    },
  });

  const response = await getAdminMatchMarketCatalog("soccer", { token: "jwt-token" });

  assert.equal(response.sport_slug, "soccer");
  assertJsonRequest(calls[0], {
    method: "GET",
    path: "/admin/events/matches/catalog/soccer",
    token: "jwt-token",
  });
});

test("listAdminEvents sends the admin recovery query", async () => {
  const calls = installFetchMock({
    payload: {
      events: [buildAdminEventCard()],
      limit: 25,
      offset: 0,
    },
  });

  const response = await listAdminEvents(
    {
      publication_status: "draft",
      limit: 25,
    },
    { token: "jwt-token" },
  );

  assert.equal(response.events[0]?.id, "event-id");
  const url = readRequestUrl(calls[0]);
  assert.equal(url.pathname, "/admin/events");
  assert.equal(url.searchParams.get("publication_status"), "draft");
  assert.equal(url.searchParams.get("limit"), "25");
  assert.equal(readAuthorizationHeader(calls[0].init), "Bearer jwt-token");
});

test("getAdminEvent reads the admin event detail endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      markets_count: 2,
    },
  });

  const response = await getAdminEvent("event-id", { token: "jwt-token" });

  assert.equal(response.markets_count, 2);
  assertJsonRequest(calls[0], {
    method: "GET",
    path: "/admin/events/event-id",
    token: "jwt-token",
  });
});

test("updateAdminEventMatchup patches the matchup payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        matchup: buildMatchup({
          status: "live",
          home: {
            ...buildMatchup().home,
            score: 1,
          },
          away: {
            ...buildMatchup().away,
            score: 0,
          },
        }),
      },
      on_chain: buildEventOnChain(),
      markets_count: 5,
    },
  });

  const payload = {
    matchup: buildMatchup({
      status: "live",
      home: {
        ...buildMatchup().home,
        score: 1,
      },
      away: {
        ...buildMatchup().away,
        score: 0,
      },
    }),
  };

  const response = await updateAdminEventMatchup("event-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.event.matchup?.status, "live");
  assertJsonRequest(calls[0], {
    method: "PATCH",
    path: "/admin/events/event-id/matchup",
    body: payload,
    token: "jwt-token",
  });
});

test("publishAdminEventShell posts to the event publish endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        publication_status: "published",
      },
      on_chain: {
        ...buildEventOnChain(),
        tx_hash: "0xtxhash",
      },
      markets_count: 2,
    },
  });

  const response = await publishAdminEventShell("event-id", {
    token: "jwt-token",
  });

  assert.equal(response.event.publication_status, "published");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/publish",
    token: "jwt-token",
  });
});

test("createAdminEventMarkets posts to the event markets endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event_id: "event-id",
      event_slug: "event-slug",
      markets: [buildMarket()],
    },
  });

  const payload = {
    markets: [
      {
        label: "Yes",
        slug: "yes",
        question: "Will it happen?",
        end_time: "2026-04-03T00:00:00Z",
        oracle_address: "0xoracle",
      },
    ],
  };

  const response = await createAdminEventMarkets("event-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.event_id, "event-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/markets",
    body: payload,
    token: "jwt-token",
  });
});

test("getAdminEventMarkets reads admin event markets with filters", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      markets: [buildMarket()],
    },
  });

  const response = await getAdminEventMarkets(
    "event-id",
    {
      publication_status: "draft",
    },
    { token: "jwt-token" },
  );

  assert.equal(response.markets.length, 1);
  const url = readRequestUrl(calls[0]);
  assert.equal(url.pathname, "/admin/events/event-id/markets");
  assert.equal(url.searchParams.get("publication_status"), "draft");
  assert.equal(readAuthorizationHeader(calls[0].init), "Bearer jwt-token");
});

test("publishAdminEventMarkets posts to the event markets publish endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event: {
        ...buildEvent(),
        publication_status: "published",
      },
      on_chain: {
        ...buildEventOnChain(),
        tx_hash: "0xtxhash",
      },
      markets: [
        {
          ...buildMarket(),
          publication_status: "published",
          condition_id: "condition-id",
        },
      ],
    },
  });

  const response = await publishAdminEventMarkets("event-id", {
    token: "jwt-token",
  });

  assert.equal(response.markets[0]?.condition_id, "condition-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/markets/publish",
    token: "jwt-token",
  });
});

test("createAdminEventMarketLadder posts to the ladder endpoint", async () => {
  const calls = installFetchMock({
    payload: {
      event_id: "event-id",
      event_slug: "event-slug",
      markets: [buildMarket()],
    },
  });

  const payload = {
    template: {
      underlying: "BTC",
      deadline_label: "April 10 close",
      end_time: "2026-04-10T20:00:00Z",
      oracle_address: "0xoracle",
      unit_symbol: "$",
      up_thresholds: ["85000", "90000"],
      down_thresholds: ["75000", "70000"],
    },
    publish: {
      mode: "draft" as const,
    },
  };

  const response = await createAdminEventMarketLadder("event-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.event_id, "event-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/markets/ladders",
    body: payload,
    token: "jwt-token",
  });
});

test("registerAdminNegRiskEvent posts the neg risk payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      neg_risk: {
        registered: true,
        has_other: false,
        other_market_id: null,
        other_condition_id: null,
        tx_hash: null,
        registered_by_user_id: "user-id",
        registered_at: "2026-04-02T12:00:00Z",
      },
      updated_at: "2026-04-02T12:00:00Z",
    },
  });

  const payload = {
    neg_risk: {
      other_market_id: null,
    },
  };

  const response = await registerAdminNegRiskEvent("event-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.neg_risk.registered, true);
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/neg-risk/register",
    body: payload,
    token: "jwt-token",
  });
});

test("createAdminMarket posts the standalone market payload", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      market: buildMarket(),
      created_at: "2026-04-02T12:00:00Z",
    },
  });

  const payload = {
    market: {
      title: "Will BTC break 100k?",
      slug: "btc-100k",
      category_slug: "crypto",
      rules: "Rules",
      end_time: "2026-04-03T00:00:00Z",
    },
    chain: {
      oracle_address: "0xoracle",
    },
  };

  const response = await createAdminMarket(payload, { token: "jwt-token" });

  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets",
    body: payload,
    token: "jwt-token",
  });
});

test("updateAdminMarket patches the requested market", async () => {
  const calls = installFetchMock({
    payload: {
      event: buildEvent(),
      on_chain: buildEventOnChain(),
      market: buildMarket(),
      updated_at: "2026-04-02T12:00:00Z",
    },
  });

  const payload = {
    market: {
      label: "Updated label",
    },
  };

  const response = await updateAdminMarket("market-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "PATCH",
    path: "/admin/markets/market-id",
    body: payload,
    token: "jwt-token",
  });
});

test("setAdminMarketPrices posts the market price payload", async () => {
  const calls = installFetchMock({
    payload: buildMarketPricesResponse(),
  });

  const payload = {
    prices: {
      yes_bps: 120,
      no_bps: 9880,
    },
  };

  const response = await setAdminMarketPrices("market-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.prices.yes_bps, 120);
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/prices",
    body: payload,
    token: "jwt-token",
  });
});

test("bootstrapAdminMarketLiquidity posts the market bootstrap payload", async () => {
  const calls = installFetchMock({
    payload: buildMarketLiquidityBootstrapResponse(),
  });

  const payload = {
    liquidity: {
      yes_bps: 120,
      no_bps: 9880,
      inventory_usdc_amount: "1000",
      exit_collateral_usdc_amount: "250",
    },
  };

  const response = await bootstrapAdminMarketLiquidity("market-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.bootstrap.inventory_usdc_amount, "1000");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/liquidity/bootstrap",
    body: payload,
    token: "jwt-token",
  });
});

test("bootstrapAdminEventLiquidity posts the event bootstrap payload", async () => {
  const calls = installFetchMock({
    payload: buildEventLiquidityBootstrapResponse(),
  });

  const payload = {
    liquidity: {
      markets: [
        {
          market_id: "market-id",
          yes_bps: 120,
          no_bps: 9880,
          inventory_usdc_amount: "1000",
          exit_collateral_usdc_amount: "250",
        },
      ],
    },
  };

  const response = await bootstrapAdminEventLiquidity("event-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.results[0]?.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/events/event-id/liquidity/bootstrap",
    body: payload,
    token: "jwt-token",
  });
});

test("pauseAdminMarket posts to the pause endpoint", async () => {
  const calls = installFetchMock({
    payload: buildTradingStatusResponse(),
  });

  const response = await pauseAdminMarket("market-id", { token: "jwt-token" });

  assert.equal(response.market.trading_status, "paused");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/pause",
    token: "jwt-token",
  });
});

test("unpauseAdminMarket posts to the unpause endpoint", async () => {
  const calls = installFetchMock({
    payload: buildTradingStatusResponse(),
  });

  const response = await unpauseAdminMarket("market-id", { token: "jwt-token" });

  assert.equal(response.market.trading_status, "paused");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/unpause",
    token: "jwt-token",
  });
});

test("proposeAdminMarketResolution posts the resolution proposal", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse(),
  });

  const payload = {
    resolution: {
      winning_outcome: 1,
      notes: "Resolved by oracle",
    },
  };

  const response = await proposeAdminMarketResolution("market-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.resolution.status, "proposed");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/propose",
    body: payload,
    token: "jwt-token",
  });
});

test("disputeAdminMarketResolution posts the dispute payload", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse(),
  });

  const payload = {
    resolution: {
      reason: "Outcome feed disagrees",
    },
  };

  const response = await disputeAdminMarketResolution("market-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.resolution.status, "proposed");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/dispute",
    body: payload,
    token: "jwt-token",
  });
});

test("finalizeAdminMarketResolution posts to the finalize endpoint", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse(),
  });

  const response = await finalizeAdminMarketResolution("market-id", {
    token: "jwt-token",
  });

  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/finalize",
    token: "jwt-token",
  });
});

test("emergencyResolveAdminMarket posts the emergency resolution payload", async () => {
  const calls = installFetchMock({
    payload: buildResolutionWorkflowResponse(),
  });

  const payload = {
    resolution: {
      winning_outcome: 0,
      reason: "Emergency admin action",
    },
  };

  const response = await emergencyResolveAdminMarket("market-id", payload, {
    token: "jwt-token",
  });

  assert.equal(response.market.id, "market-id");
  assertJsonRequest(calls[0], {
    method: "POST",
    path: "/admin/markets/market-id/resolution/emergency",
    body: payload,
    token: "jwt-token",
  });
});

function installFetchMock({ payload, status = 200, headers }: MockResponseInit) {
  const calls: RecordedFetchCall[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ input, init });

    return new Response(payload === undefined ? null : JSON.stringify(payload), {
      status,
      headers: headers ?? {
        "content-type": "application/json",
      },
    });
  }) as typeof fetch;

  return calls;
}

function assertJsonRequest(
  call: RecordedFetchCall | undefined,
  expected: {
    method: string;
    path: string;
    body?: unknown;
    token?: string;
  },
) {
  assert.ok(call);
  assert.equal(readRequestPath(call), expected.path);
  assert.equal(call.init?.method, expected.method);

  if (expected.token) {
    assert.equal(readAuthorizationHeader(call.init), `Bearer ${expected.token}`);
  }

  if (expected.body !== undefined) {
    assert.deepEqual(JSON.parse(String(call.init?.body)), expected.body);
    assert.equal(readContentTypeHeader(call.init), "application/json");
  }
}

function readRequestPath(call: RecordedFetchCall) {
  return readRequestUrl(call).pathname;
}

function readRequestUrl(call: RecordedFetchCall) {
  const rawUrl = typeof call.input === "string" ? call.input : call.input.toString();
  return new URL(rawUrl);
}

function readAuthorizationHeader(init?: RequestInit) {
  return new Headers(init?.headers).get("authorization");
}

function readContentTypeHeader(init?: RequestInit) {
  return new Headers(init?.headers).get("content-type");
}

function buildUser() {
  return {
    id: "user-id",
    email: null,
    username: "admin",
    display_name: "Admin",
    avatar_url: null,
    wallet: {
      wallet_address: "0xabc123",
      chain_id: 1952,
      created_at: "2026-04-02T12:00:00Z",
    },
    created_at: "2026-04-02T12:00:00Z",
    updated_at: "2026-04-02T12:00:00Z",
  };
}

function buildEvent() {
  return {
    title: "Event",
    slug: "event",
    category_slug: "politics",
    subcategory_slug: null,
    tag_slugs: [],
    image_url: null,
    matchup: null,
    summary: null,
    rules: "Rules",
    context: null,
    additional_context: null,
    resolution_sources: [],
    resolution_timezone: "UTC",
    starts_at: null,
    sort_at: null,
    featured: false,
    breaking: false,
    searchable: true,
    visible: true,
    hide_resolved_by_default: false,
    publication_status: "draft",
  };
}

function buildAdminEventCard() {
  return {
    id: "event-id",
    title: "Event",
    slug: "event",
    category_slug: "politics",
    subcategory_slug: null,
    tag_slugs: [],
    image_url: null,
    matchup: null,
    summary: null,
    featured: false,
    breaking: false,
    neg_risk: false,
    publication_status: "draft",
    starts_at: null,
    sort_at: null,
    created_at: "2026-04-02T12:00:00Z",
    market_count: 2,
  };
}

function buildEventOnChain() {
  return {
    event_id: "1",
    group_id: "2",
    series_id: "3",
    neg_risk: false,
    tx_hash: null,
  };
}

function buildMatchup(
  overrides: Partial<{
    sport_slug: string;
    competition_name: string | null;
    round_name: string | null;
    fixture_id: string | null;
    status: string;
    home: {
      name: string;
      short_name: string | null;
      code: string | null;
      image_url: string | null;
      score: number | null;
    };
    away: {
      name: string;
      short_name: string | null;
      code: string | null;
      image_url: string | null;
      score: number | null;
    };
  }> = {},
) {
  return {
    sport_slug: "soccer",
    competition_name: "International Friendly",
    round_name: null,
    fixture_id: null,
    status: "scheduled",
    home: {
      name: "Australia",
      short_name: null,
      code: "aus",
      image_url: null,
      score: 0,
    },
    away: {
      name: "Turkiye",
      short_name: null,
      code: "tur",
      image_url: null,
      score: 0,
    },
    ...overrides,
  };
}

function buildMarket() {
  return {
    id: "market-id",
    slug: "market",
    label: "Market",
    question: "Will it happen?",
    question_id: "question-id",
    condition_id: null,
    market_type: "binary",
    outcomes: ["Yes", "No"],
    end_time: "2026-04-03T00:00:00Z",
    sort_order: 0,
    publication_status: "draft",
    trading_status: "paused",
  };
}

function buildTradingStatusResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: buildMarket(),
    updated_at: "2026-04-02T12:00:00Z",
  };
}

function buildMarketLiquiditySnapshot() {
  return {
    market_id: "market-id",
    condition_id: "condition-id",
    source: "monad",
    exchange_outcomes: [
      {
        outcome_index: 0,
        outcome_label: "Yes",
        available: "500",
      },
      {
        outcome_index: 1,
        outcome_label: "No",
        available: "500",
      },
    ],
    pool: {
      idle_yes_total: "50",
      idle_no_total: "50",
      posted_yes_total: "450",
      posted_no_total: "450",
      claimable_collateral_total: "25",
    },
  };
}

function buildMarketPricesResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: buildMarket(),
    prices: {
      yes_bps: 120,
      no_bps: 9880,
      tx_hashes: {
        yes_price: "0xyes",
        no_price: "0xno",
      },
    },
    updated_at: "2026-04-02T12:00:00Z",
  };
}

function buildMarketLiquidityBootstrapResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: {
      ...buildMarket(),
      condition_id: "condition-id",
      publication_status: "published",
      trading_status: "active",
    },
    bootstrap: {
      yes_bps: 120,
      no_bps: 9880,
      inventory_usdc_amount: "1000",
      exit_collateral_usdc_amount: "250",
      tx_hashes: {
        yes_price: "0xyes",
        no_price: "0xno",
        split_and_add_liquidity: "0xsplit",
        deposit_collateral: "0xdeposit",
      },
    },
    liquidity: buildMarketLiquiditySnapshot(),
    updated_at: "2026-04-02T12:00:00Z",
  };
}

function buildEventLiquidityBootstrapResponse() {
  return {
    event: {
      ...buildEvent(),
      publication_status: "published",
    },
    on_chain: buildEventOnChain(),
    results: [
      {
        market: {
          ...buildMarket(),
          condition_id: "condition-id",
          publication_status: "published",
          trading_status: "active",
        },
        bootstrap: {
          yes_bps: 120,
          no_bps: 9880,
          inventory_usdc_amount: "1000",
          exit_collateral_usdc_amount: "250",
          tx_hashes: {
            yes_price: "0xyes",
            no_price: "0xno",
            split_and_add_liquidity: "0xsplit",
            deposit_collateral: null,
          },
        },
        liquidity: buildMarketLiquiditySnapshot(),
      },
    ],
    updated_at: "2026-04-02T12:00:00Z",
  };
}

function buildResolutionWorkflowResponse() {
  return {
    event: buildEvent(),
    on_chain: buildEventOnChain(),
    market: buildMarket(),
    resolution: {
      status: "proposed",
      proposed_winning_outcome: 1,
      final_winning_outcome: null,
      payout_vector_hash: "0xhash",
      proposed_by_user_id: "user-id",
      proposed_at: "2026-04-02T12:00:00Z",
      dispute_deadline: "2026-04-03T12:00:00Z",
      notes: null,
      disputed_by_user_id: null,
      disputed_at: null,
      dispute_reason: null,
      finalized_by_user_id: null,
      finalized_at: null,
      emergency_resolved_by_user_id: null,
      emergency_resolved_at: null,
    },
    updated_at: "2026-04-02T12:00:00Z",
  };
}
