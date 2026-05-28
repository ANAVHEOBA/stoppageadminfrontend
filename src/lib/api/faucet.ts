import { apiRequest } from "~/lib/api/core";

export interface FaucetUsdcRequest {
  address: string;
  amount: string;
}

export interface FaucetUsdcResponse {
  token_address: string;
  recipient: string;
  amount: string;
  tx_hash: string;
  requested_at: string;
}

export interface FaucetUsdcBalanceResponse {
  token_address: string;
  address: string;
  balance: string;
  queried_at: string;
}

export function requestUsdcFaucet(payload: FaucetUsdcRequest, signal?: AbortSignal) {
  return apiRequest<FaucetUsdcResponse, FaucetUsdcRequest>({
    method: "POST",
    path: "/faucet/usdc",
    body: payload,
    signal,
  });
}

export function getUsdcFaucetBalance(address: string, signal?: AbortSignal) {
  return apiRequest<FaucetUsdcBalanceResponse>({
    method: "GET",
    path: "/faucet/usdc/balance",
    query: {
      address,
    },
    signal,
  });
}
