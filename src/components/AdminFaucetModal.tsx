import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import type { AdminMeResponse } from "~/lib/api/admin";
import { getErrorMessage } from "~/lib/api/core";
import {
  getUsdcFaucetBalance,
  requestUsdcFaucet,
  type FaucetUsdcBalanceResponse,
  type FaucetUsdcResponse,
} from "~/lib/api/faucet";
import { parseUsdcDollarsToBaseUnits } from "~/lib/usdc";

const BIGINT_ZERO = BigInt("0");
const BIGINT_HUNDRED = BigInt("100");
const BIGINT_ROUNDING_BASE_UNITS = BigInt("5000");
const USDC_BASE_UNITS = BigInt("1000000");

interface AdminFaucetModalProps {
  open: boolean;
  profile: AdminMeResponse | null;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 13 13" aria-hidden="true">
      <path
        d="M1.5 1.5 11.5 11.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
      />
      <path
        d="M11.5 1.5 1.5 11.5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
      />
    </svg>
  );
}

function formatChainLabel(chainId: number | null | undefined) {
  if (typeof chainId === "number") {
    return `XLayer #${chainId}`;
  }

  return "XLayer";
}

function formatUsdcBaseUnits(value: string | null | undefined): string {
  if (!value) {
    return "$0.00";
  }

  try {
    const rawAmount = BigInt(value);
    const negative = rawAmount < BIGINT_ZERO;
    const normalizedAmount = negative ? -rawAmount : rawAmount;
    let wholeUnits = normalizedAmount / USDC_BASE_UNITS;
    let fractionalUnits =
      ((normalizedAmount % USDC_BASE_UNITS) + BIGINT_ROUNDING_BASE_UNITS) / BigInt("10000");

    if (fractionalUnits >= BIGINT_HUNDRED) {
      wholeUnits += BigInt("1");
      fractionalUnits = BIGINT_ZERO;
    }

    const formattedFractionalUnits = fractionalUnits.toString().padStart(2, "0");
    return `${negative ? "-" : ""}$${wholeUnits.toString()}.${formattedFractionalUnits}`;
  } catch {
    return value;
  }
}

export default function AdminFaucetModal(props: AdminFaucetModalProps) {
  const [recipientAddress, setRecipientAddress] = createSignal("");
  const [amountInput, setAmountInput] = createSignal("100");
  const [balance, setBalance] = createSignal<FaucetUsdcBalanceResponse | null>(null);
  const [mintResult, setMintResult] = createSignal<FaucetUsdcResponse | null>(null);
  const [balanceError, setBalanceError] = createSignal<string | null>(null);
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  const [loadingBalance, setLoadingBalance] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);
  let requestCounter = 0;

  createEffect(() => {
    if (!props.open || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        props.onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  createEffect(() => {
    if (!props.open) {
      return;
    }

    const initialAddress = props.profile?.user.wallet?.wallet_address?.trim() ?? "";

    setRecipientAddress(initialAddress);
    setAmountInput("100");
    setBalance(null);
    setMintResult(null);
    setBalanceError(null);
    setSubmitError(null);

    if (initialAddress) {
      void refreshBalance(initialAddress);
    }
  });

  const refreshBalance = async (addressOverride?: string) => {
    const address = (addressOverride ?? recipientAddress()).trim();
    const currentRequestId = requestCounter + 1;
    requestCounter = currentRequestId;

    setBalance(null);
    setBalanceError(null);

    if (!address) {
      setBalanceError("Recipient address is required to query the faucet balance.");
      return;
    }

    setLoadingBalance(true);

    try {
      const response = await getUsdcFaucetBalance(address);

      if (requestCounter !== currentRequestId) {
        return;
      }

      setBalance(response);
    } catch (error) {
      if (requestCounter !== currentRequestId) {
        return;
      }

      setBalanceError(getErrorMessage(error));
    } finally {
      if (requestCounter === currentRequestId) {
        setLoadingBalance(false);
      }
    }
  };

  const handleMint = async (event: SubmitEvent) => {
    event.preventDefault();

    const address = recipientAddress().trim();

    setSubmitError(null);
    setMintResult(null);

    try {
      if (!address) {
        throw new Error("Recipient address is required.");
      }

      const amount = parseUsdcDollarsToBaseUnits(amountInput(), "Faucet USDC amount");

      setSubmitting(true);

      const response = await requestUsdcFaucet({
        address,
        amount,
      });

      setMintResult(response);
      await refreshBalance(address);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Show when={props.open}>
      <Portal>
        <div class="pm-faucet-modal__overlay" onClick={props.onClose}>
          <section
            class="pm-faucet-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-faucet-modal-title"
            onClick={event => event.stopPropagation()}
          >
            <div class="pm-faucet-modal__frame">
              <div class="pm-faucet-modal__header">
                <div class="pm-faucet-modal__header-copy">
                  <h2 class="pm-faucet-modal__title" id="pm-faucet-modal-title">
                    USDC Faucet
                  </h2>
                  <p class="pm-faucet-modal__subtitle">
                    Mint mock USDC to a wallet using the backend faucet on {formatChainLabel(props.profile?.xlayer_chain_id)}.
                  </p>
                </div>

                <button
                  class="pm-faucet-modal__icon-button"
                  type="button"
                  aria-label="Close"
                  onClick={props.onClose}
                >
                  <CloseIcon />
                </button>
              </div>

              <div class="pm-faucet-modal__chips">
                <span class="pm-market-chip">{formatChainLabel(props.profile?.xlayer_chain_id)}</span>
                <span class="pm-market-chip">Mock USDC</span>
              </div>

              <form class="pm-market-form pm-faucet-modal__form" onSubmit={event => void handleMint(event)}>
                <div class="pm-market-fields">
                  <label class="pm-field pm-field--full">
                    <span class="pm-field__label">Recipient address</span>
                    <input
                      class="pm-field__input"
                      type="text"
                      name="recipient_address"
                      placeholder="0x..."
                      value={recipientAddress()}
                      onInput={event => setRecipientAddress(event.currentTarget.value)}
                    />
                  </label>

                  <label class="pm-field">
                    <span class="pm-field__label">Faucet USDC amount (dollars)</span>
                    <input
                      class="pm-field__input"
                      type="text"
                      name="amount"
                      inputMode="decimal"
                      placeholder="100"
                      value={amountInput()}
                      onInput={event => setAmountInput(event.currentTarget.value)}
                    />
                  </label>

                  <div class="pm-faucet-modal__summary-card">
                    <span class="pm-faucet-modal__summary-label">Current faucet balance</span>
                    <span class="pm-faucet-modal__summary-value">
                      {loadingBalance() ? "Loading..." : formatUsdcBaseUnits(balance()?.balance)}
                    </span>
                    <Show when={balance()?.token_address}>
                      {tokenAddress => (
                        <code class="pm-faucet-modal__summary-meta" title={tokenAddress()}>
                          {tokenAddress()}
                        </code>
                      )}
                    </Show>
                    <button
                      class="pm-button pm-button--ghost"
                      type="button"
                      disabled={loadingBalance() || submitting()}
                      onClick={() => void refreshBalance()}
                    >
                      {loadingBalance() ? "Refreshing..." : "Refresh balance"}
                    </button>
                  </div>
                </div>

                <p class="pm-faucet-modal__hint">
                  Enter a dollar amount and the frontend will convert it to raw 6-decimal USDC base units before sending it to the backend faucet.
                </p>

                <Show when={balanceError()}>
                  {message => (
                    <p class="pm-faucet-modal__feedback pm-faucet-modal__feedback--error">
                      {message()}
                    </p>
                  )}
                </Show>

                <Show when={submitError()}>
                  {message => (
                    <p class="pm-faucet-modal__feedback pm-faucet-modal__feedback--error">
                      {message()}
                    </p>
                  )}
                </Show>

                <Show when={mintResult()}>
                  {result => (
                    <div class="pm-faucet-modal__result">
                      <div class="pm-faucet-modal__result-header">
                        <span class="pm-faucet-modal__result-title">Faucet mint submitted</span>
                        <span class="pm-market-chip">{formatUsdcBaseUnits(result().amount)}</span>
                      </div>
                      <div class="pm-faucet-modal__result-grid">
                        <div class="pm-faucet-modal__result-item">
                          <span class="pm-faucet-modal__result-label">Recipient</span>
                          <code class="pm-faucet-modal__result-value">{result().recipient}</code>
                        </div>
                        <div class="pm-faucet-modal__result-item">
                          <span class="pm-faucet-modal__result-label">Tx hash</span>
                          <code class="pm-faucet-modal__result-value">{result().tx_hash}</code>
                        </div>
                      </div>
                    </div>
                  )}
                </Show>

                <div class="pm-faucet-modal__actions">
                  <button class="pm-button pm-button--ghost" type="button" onClick={props.onClose}>
                    Cancel
                  </button>
                  <button
                    class="pm-button pm-button--primary"
                    type="submit"
                    disabled={submitting() || loadingBalance()}
                  >
                    {submitting() ? "Minting..." : "Mint faucet USDC"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </Portal>
    </Show>
  );
}
