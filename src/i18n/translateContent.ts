import type { ContentLang, Locale } from "./types";

const CACHE_KEY = "translation_cache_v2";
const MAX_CACHE_ENTRIES = 2000;
const DELIMITER = "\n\n===XXX===\n\n";
const MAX_URL_LEN = 1500;

type CacheStore = Record<string, string>;

type GtxResponse = [Array<[string, string, ...unknown[]]>, ...unknown[]];

function readCache(): CacheStore {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as CacheStore;
  } catch {
    return {};
  }
}

function writeCache(cache: CacheStore) {
  const entries = Object.entries(cache);
  if (entries.length > MAX_CACHE_ENTRIES) {
    const trimmed = Object.fromEntries(entries.slice(-MAX_CACHE_ENTRIES));
    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
    return;
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function cacheKey(text: string, from: ContentLang, to: Locale): string {
  return `${from}|${to}|${text}`;
}

interface QueueItem {
  text: string;
  from: ContentLang;
  to: Locale;
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}

let translationQueue: QueueItem[] = [];
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

async function processQueue(items: QueueItem[]) {
  if (items.length === 0) return;

  const groups = new Map<string, QueueItem[]>();
  for (const item of items) {
    const key = `${item.from}|${item.to}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  for (const [key, groupItems] of groups.entries()) {
    const [from, to] = key.split("|") as [ContentLang, Locale];
    let currentBatch: QueueItem[] = [];
    let currentLen = 0;

    const flushBatch = async (batch: QueueItem[]) => {
      if (batch.length === 0) return;
      const combined = batch.map((i) => i.text).join(DELIMITER);

      const params = new URLSearchParams({
        client: "gtx",
        sl: from,
        tl: to,
        dt: "t",
        q: combined,
      });

      try {
        const response = await fetch(`/gtx/translate_a/single?${params}`);
        if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);

        const data = (await response.json()) as GtxResponse;
        const segments = data[0];
        if (!segments?.length) throw new Error("Translation service unavailable");

        const translatedCombined = segments.map((segment) => segment[0]).join("");
        
        // Split and trim to avoid whitespace issues, using regex to catch spacing/casing variations from GT
        const translatedParts = translatedCombined
          .split(/={1,4}\s*X{1,4}\s*={1,4}/i)
          .map((s) => s.trim());

        const cache = readCache();

        batch.forEach((item, index) => {
          let translated = translatedParts[index];
          if (!translated) translated = item.text;
          cache[cacheKey(item.text, from, to)] = translated;
          item.resolve(translated);
        });

        writeCache(cache);
      } catch (error) {
        batch.forEach((item) => item.reject(error));
      }
    };

    for (const item of groupItems) {
      if (currentLen + item.text.length + DELIMITER.length > MAX_URL_LEN) {
        await flushBatch(currentBatch);
        currentBatch = [item];
        currentLen = item.text.length;
      } else {
        currentBatch.push(item);
        currentLen += item.text.length + DELIMITER.length;
      }
    }
    if (currentBatch.length > 0) {
      await flushBatch(currentBatch);
    }
  }
}

export function translateText(
  text: string,
  from: ContentLang,
  to: Locale,
): Promise<string> {
  const cleanText = text.trim();
  if (!cleanText || from === to) return Promise.resolve(cleanText);

  const cache = readCache();
  const key = cacheKey(cleanText, from, to);
  if (cache[key]) return Promise.resolve(cache[key]);

  return new Promise((resolve, reject) => {
    translationQueue.push({ text: cleanText, from, to, resolve, reject });
    if (batchTimeout) clearTimeout(batchTimeout);
    batchTimeout = setTimeout(() => {
      const itemsToProcess = [...translationQueue];
      translationQueue = [];
      processQueue(itemsToProcess);
    }, 50);
  });
}
