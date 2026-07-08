export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = signal ? undefined : new AbortController();
  const effectiveSignal = signal ?? controller?.signal;

  const timeoutId = controller
    ? setTimeout(() => controller.abort(), 30_000)
    : undefined;

  try {
    const response = await fetch(url, { signal: effectiveSignal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error(
        `Response is not valid JSON for URL: ${url}. Check the proxy in vite.config.ts.`,
      );
    }

    return response.json() as Promise<T>;
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}
