import { Show, createEffect, createSignal } from "solid-js";

import { uploadAdminImage, type AdminImageAssetResponse } from "~/lib/api/admin";
import { getErrorMessage } from "~/lib/api/core";
import { useAsyncTask } from "~/lib/hooks/useAsyncTask";
import { normalizeOptionalMediaUrl } from "~/lib/media";

interface AdminImageUrlFieldProps {
  name: string;
  scope: string;
  label?: string;
  placeholder?: string;
  value?: string;
}

export default function AdminImageUrlField(props: AdminImageUrlFieldProps) {
  const uploadTask = useAsyncTask((file: File) =>
    uploadAdminImage({
      file,
      scope: props.scope,
      fileName: file.name,
    }),
  );
  const [error, setError] = createSignal<string | null>(null);
  const [uploadedAsset, setUploadedAsset] = createSignal<AdminImageAssetResponse | null>(null);
  const [currentValue, setCurrentValue] = createSignal(
    normalizeOptionalMediaUrl(props.value) ?? "",
  );
  let fileInput: HTMLInputElement | undefined;

  createEffect(() => {
    setCurrentValue(normalizeOptionalMediaUrl(props.value) ?? "");
  });

  async function handleFileSelection(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    try {
      const response = await uploadTask.run(file);
      setUploadedAsset(response.asset);
      setCurrentValue(response.asset.gateway_url);
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      input.value = "";
    }
  }

  return (
    <>
      <label class="pm-field">
        <span class="pm-field__label">{props.label ?? "Image URL"}</span>
        <input
          class="pm-field__input"
          name={props.name}
          type="url"
          placeholder={props.placeholder ?? "https://..."}
          value={currentValue()}
          onInput={event => setCurrentValue(event.currentTarget.value)}
        />
      </label>

      <div class="pm-upload-inline">
        <span class="pm-field__label">Upload image</span>

        <input
          class="pm-upload-inline__input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
          disabled={uploadTask.pending()}
          ref={element => {
            fileInput = element;
          }}
          onChange={handleFileSelection}
        />

        <button
          class="pm-button pm-button--ghost"
          type="button"
          disabled={uploadTask.pending()}
          onClick={() => fileInput?.click()}
        >
          {uploadTask.pending() ? "Uploading..." : "Upload and fill URL"}
        </button>
      </div>

      <Show when={uploadedAsset() || error() || uploadTask.pending()}>
        <div class="pm-upload-inline__status pm-field--full">
          <Show when={uploadTask.pending()}>
            <span class="pm-market-result__value">Uploading image...</span>
          </Show>

          <Show when={uploadedAsset()}>
            {asset => (
              <div class="pm-upload-inline__asset">
                <span class="pm-market-result__label">Uploaded</span>
                <a
                  class="pm-market-result__link"
                  href={asset().gateway_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {asset().file_name}
                </a>
                <span class="pm-upload-inline__meta">{asset().gateway_url}</span>
              </div>
            )}
          </Show>

          <Show when={error()}>
            {message => <p class="pm-market-feedback pm-market-feedback--error">{message()}</p>}
          </Show>
        </div>
      </Show>
    </>
  );
}
