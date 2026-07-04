import type { ContentLang, Locale } from "./types";

const CACHE_KEY = "translation_cache_v1";
const CHUNK_SIZE = 1800;
const MAX_CACHE_ENTRIES = 300;

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

function splitIntoChunks(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > CHUNK_SIZE) {
    let splitAt = remaining.lastIndexOf(". ", CHUNK_SIZE);
    if (splitAt < CHUNK_SIZE * 0.4) {
      splitAt = remaining.lastIndexOf(" ", CHUNK_SIZE);
    }
    if (splitAt < CHUNK_SIZE * 0.4) {
      splitAt = CHUNK_SIZE;
    }
    chunks.push(
      remaining.slice(0, splitAt + (remaining[splitAt] === " " ? 0 : 1)).trim(),
    );
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

async function translateChunk(
  text: string,
  from: ContentLang,
  to: Locale,
): Promise<string> {
  const cache = readCache();
  const key = cacheKey(text, from, to);
  if (cache[key]) return cache[key];

  const params = new URLSearchParams({
    client: "gtx",
    sl: from,
    tl: to,
    dt: "t",
    q: text,
  });

  const response = await fetch(`/gtx/translate_a/single?${params}`);
  if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);

  const data = (await response.json()) as GtxResponse;
  const segments = data[0];
  if (!segments?.length) throw new Error("Translation service unavailable");

  const translated = segments.map((segment) => segment[0]).join("");
  cache[key] = translated;
  writeCache(cache);
  return translated;
}

export async function translateText(
  text: string,
  from: ContentLang,
  to: Locale,
): Promise<string> {
  if (!text.trim() || from === to) return text;

  const chunks = splitIntoChunks(text);
  const translated = await Promise.all(
    chunks.map((chunk) => translateChunk(chunk, from, to)),
  );
  return translated.join(" ");
}
