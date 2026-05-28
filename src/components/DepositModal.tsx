import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import type { UserResponse } from "../lib/auth/types.ts";

type DepositStep = "source" | "transfer";
type CopyStatus = "idle" | "copied" | "error";

interface DepositModalProps {
  open: boolean;
  user: UserResponse | null;
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

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M10.5 13 5.5 8l5-5"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.75"
      />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M6.2 10h3.8v3.8M3.17 10h-.04M6.95 13.8h-.04M10 16.88h-.04M16.88 10h-.04M3.13 13.8h1.15M12.67 10h1.53M3.13 16.88h3.81M10 2.36v4.58M14.28 16.88h1.37c.43 0 .65 0 .81-.08.15-.07.26-.19.34-.33.08-.17.08-.39.08-.82v-1.37c0-.43 0-.65-.08-.81a.8.8 0 0 0-.34-.34c-.16-.08-.38-.08-.81-.08h-1.37c-.43 0-.65 0-.81.08a.8.8 0 0 0-.34.34c-.08.16-.08.38-.08.81v1.37c0 .43 0 .65.08.82.08.14.19.26.34.33.16.08.38.08.81.08Zm0-9.93h1.37c.43 0 .65 0 .81-.08.15-.08.26-.19.34-.34.08-.16.08-.38.08-.81V4.35c0-.43 0-.65-.08-.81a.8.8 0 0 0-.34-.34c-.16-.08-.38-.08-.81-.08h-1.37c-.43 0-.65 0-.81.08a.8.8 0 0 0-.34.34c-.08.16-.08.38-.08.81v1.37c0 .43 0 .65.08.81.08.15.19.26.34.34.16.08.38.08.81.08Zm-9.93 0h1.37c.43 0 .65 0 .81-.08a.8.8 0 0 0 .34-.34c.08-.16.08-.38.08-.81V4.35c0-.43 0-.65-.08-.81a.8.8 0 0 0-.34-.34c-.16-.08-.38-.08-.81-.08H4.35c-.43 0-.65 0-.81.08a.8.8 0 0 0-.34.34c-.08.16-.08.38-.08.81v1.37c0 .43 0 .65.08.81.08.15.19.26.34.34.16.08.38.08.81.08Z"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4"
      />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#141c41" stroke="#141c41" />
      <path
        d="M25 17c0 1.1-2.46 2-5.5 2s-5.5-.9-5.5-2m11 0c0-1.1-2.46-2-5.5-2s-5.5.9-5.5 2m11 0v1.5M14 17v12c0 1.1 2.46 2 5.5 2m0-8c-.17 0-.33 0-.5-.01-2.8-.09-5-0.95-5-1.99m5.5 6c-3.04 0-5.5-.9-5.5-2m20 0.5c0 1.1-2.46 2-5.5 2s-5.5-.9-5.5-2m11 0c0-1.1-2.46-2-5.5-2s-5.5.9-5.5 2m11 0V31c0 1.1-2.46 2-5.5 2S23 32.1 23 31v-7.5m11 3.75c0 1.1-2.46 2-5.5 2s-5.5-.9-5.5-2"
        fill="none"
        stroke="#878a98"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M12.5 4.9 6.26 11.12 3.5 8"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 2.5h5.2c.56 0 .84 0 1.06.11.19.09.34.25.44.44.1.21.1.49.1 1.05v5.2c0 .56 0 .84-.1 1.06a1 1 0 0 1-.44.44c-.22.1-.5.1-1.06.1H6c-.56 0-.84 0-1.05-.1a1 1 0 0 1-.44-.44c-.11-.22-.11-.5-.11-1.06V4.1c0-.56 0-.84.11-1.05a1 1 0 0 1 .44-.44c.21-.11.49-.11 1.05-.11Zm-1.5 2.25v6.15c0 .79.64 1.43 1.43 1.43h6.15M3.75 5.5v-1c0-.79.64-1.43 1.43-1.43h1"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
      />
    </svg>
  );
}

function formatUsdBalance(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getChainLabel(chainId: number | null | undefined): string {
  if (chainId === 10143) {
    return "Monad";
  }

  if (typeof chainId === "number") {
    return `Chain ${chainId}`;
  }

  return "Monad";
}

async function copyToClipboard(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the textarea fallback.
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.append(input);
  input.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    input.remove();
  }
}

export default function DepositModal(props: DepositModalProps) {
  const [step, setStep] = createSignal<DepositStep>("source");
  const [copyStatus, setCopyStatus] = createSignal<CopyStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = createSignal<string | null>(null);
  let copyTimer: number | undefined;

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
    if (props.open) {
      setStep("source");
      setCopyStatus("idle");
      setFeedbackMessage(null);
      return;
    }

    if (copyTimer !== undefined) {
      window.clearTimeout(copyTimer);
      copyTimer = undefined;
    }
  });

  const depositAddress = () => props.user?.wallet?.wallet_address ?? "";
  const chainLabel = () => getChainLabel(props.user?.wallet?.chain_id);
  const hasDepositAddress = () => depositAddress().length > 0;

  const handleCopyAddress = async () => {
    if (!hasDepositAddress()) {
      setCopyStatus("error");
      setFeedbackMessage("No deposit address is available for this account.");
      return;
    }

    const copied = await copyToClipboard(depositAddress());

    if (copyTimer !== undefined) {
      window.clearTimeout(copyTimer);
    }

    if (copied) {
      setCopyStatus("copied");
      setFeedbackMessage("Deposit address copied.");
      copyTimer = window.setTimeout(() => {
        setCopyStatus("idle");
        setFeedbackMessage(null);
      }, 1600);
      return;
    }

    setCopyStatus("error");
    setFeedbackMessage("Unable to copy the deposit address.");
  };

  return (
    <Show when={props.open}>
      <Portal>
        <div class="pm-deposit-modal__overlay" onClick={props.onClose}>
          <section
            class="pm-deposit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-deposit-modal-title"
            onClick={event => event.stopPropagation()}
          >
            <div class="pm-deposit-modal__frame">
              <div class="pm-deposit-modal__header">
                <div class="pm-deposit-modal__header-slot">
                  <Show when={step() === "transfer"}>
                    <button
                      class="pm-deposit-modal__icon-button"
                      type="button"
                      aria-label="Back"
                      onClick={() => setStep("source")}
                    >
                      <BackIcon />
                    </button>
                  </Show>
                </div>

                <div class="pm-deposit-modal__header-copy">
                  <h2 class="pm-deposit-modal__title" id="pm-deposit-modal-title">
                    {step() === "transfer" ? "Transfer Crypto" : "Deposit"}
                  </h2>
                  <p class="pm-deposit-modal__subtitle">
                    Sabimarket Balance: {formatUsdBalance(0)}
                  </p>
                </div>

                <div class="pm-deposit-modal__header-slot pm-deposit-modal__header-slot--end">
                  <button
                    class="pm-deposit-modal__icon-button"
                    type="button"
                    aria-label="Close"
                    onClick={props.onClose}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <Show
                when={step() === "source"}
                fallback={
                  <div class="pm-deposit-transfer">
                    <div class="pm-deposit-transfer__details">
                      <div class="pm-deposit-transfer__field">
                        <div class="pm-deposit-transfer__label">Supported token</div>
                        <div class="pm-deposit-transfer__value">USDC</div>
                      </div>

                      <div class="pm-deposit-transfer__field">
                        <div class="pm-deposit-transfer__label">Supported chain</div>
                        <div class="pm-deposit-transfer__value">
                          <span class="pm-chain-pill pm-chain-pill--monad">
                            {chainLabel()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="pm-deposit-transfer__address-card">
                      <div class="pm-deposit-transfer__address-header">
                        <div>
                          <div class="pm-deposit-transfer__label">
                            Your deposit address
                          </div>
                          <div class="pm-deposit-transfer__hint">
                            Send USDC on {chainLabel()} only.
                          </div>
                        </div>
                        <a
                          class="pm-deposit-transfer__terms"
                          href="#terms"
                        >
                          Terms apply
                        </a>
                      </div>

                      <Show
                        when={hasDepositAddress()}
                        fallback={
                          <div class="pm-deposit-transfer__empty">
                            No deposit address is available for this account.
                          </div>
                        }
                      >
                        <div class="pm-deposit-transfer__address-box">
                          <code class="pm-deposit-transfer__address">
                            {depositAddress()}
                          </code>
                        </div>

                        <button
                          class={`pm-deposit-transfer__copy${
                            copyStatus() === "copied"
                              ? " pm-deposit-transfer__copy--copied"
                              : ""
                          }`}
                          type="button"
                          onClick={() => void handleCopyAddress()}
                        >
                          <span class="pm-deposit-transfer__copy-icon" aria-hidden="true">
                            <Show
                              when={copyStatus() === "copied"}
                              fallback={<CopyIcon />}
                            >
                              <CheckIcon />
                            </Show>
                          </span>
                          <span>
                            {copyStatus() === "copied"
                              ? "Copied"
                              : "Copy address"}
                          </span>
                        </button>
                      </Show>
                    </div>

                    <Show when={feedbackMessage()}>
                      {message => (
                        <p
                          class={`pm-deposit-transfer__feedback${
                            copyStatus() === "error"
                              ? " pm-deposit-transfer__feedback--error"
                              : ""
                          }`}
                        >
                          {message()}
                        </p>
                      )}
                    </Show>

                    <p class="pm-deposit-transfer__footer-note">
                      Transfers usually settle in under a minute after the deposit
                      reaches {chainLabel()}.
                    </p>
                  </div>
                }
              >
                <div class="pm-deposit-source">
                  <button
                    class="pm-deposit-source__option"
                    type="button"
                    onClick={() => setStep("transfer")}
                  >
                    <div class="pm-deposit-source__option-main">
                      <span class="pm-deposit-source__option-icon">
                        <TransferIcon />
                      </span>

                      <span class="pm-deposit-source__option-copy">
                        <span class="pm-deposit-source__option-title">
                          Transfer Crypto
                        </span>
                        <span class="pm-deposit-source__option-subtitle">
                          No limit • Instant
                        </span>
                      </span>
                    </div>

                    <span class="pm-deposit-source__option-badges" aria-hidden="true">
                      <span class="pm-chain-pill">USDC</span>
                      <span class="pm-chain-pill pm-chain-pill--monad">
                        {chainLabel()}
                      </span>
                    </span>
                  </button>

                  <div class="pm-deposit-source__empty-state">
                    <span class="pm-deposit-source__empty-icon">
                      <DatabaseIcon />
                    </span>
                    <div class="pm-deposit-source__empty-copy">
                      <p class="pm-deposit-source__empty-title">
                        Deposit on {chainLabel()}
                      </p>
                      <p class="pm-deposit-source__empty-description">
                        Use the transfer flow to copy your deposit address and send
                        USDC directly to your Sabimarket account.
                      </p>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </section>
        </div>
      </Portal>
    </Show>
  );
}
