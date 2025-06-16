export const ossDomain = "https://oss01.980410.xyz/pandaoss.conf.json";

import axios from "axios";

const CACHE_KEY = "oss_base_url";
const CACHE_NAME_KEY = "oss_base_name";

export interface OssConfigItem {
  name: string;
  url: string;
}

export async function fetchOssConfig(): Promise<OssConfigItem[]> {
  try {
    const { data } = await axios.get<OssConfigItem[]>(ossDomain, {
      timeout: 10000,
    });
    if (!Array.isArray(data)) {
      throw new Error("Invalid oss config format");
    }
    return data;
  } catch (err: any) {
    console.error("Failed to fetch oss config", err);
    throw new Error(err?.message || "Failed to fetch oss config");
  }
}

export async function testOssUrl(url: string): Promise<number> {
  const testPath = url.replace(/\/+$/, "") + "/globalize/v1/guest/comm/config";
  const start = Date.now();
  try {
    await axios.get(testPath, { timeout: 3000 });
    return Date.now() - start;
  } catch {
    return Infinity;
  }
}

let baseUrlPromise: Promise<string> | null = null;

export async function selectBestOssServer(force = false): Promise<string> {
  const cachedUrl = localStorage.getItem(CACHE_KEY);

  if (!force && cachedUrl) {
    const delay = await testOssUrl(cachedUrl);
    if (delay !== Infinity) {
      baseUrlPromise = Promise.resolve(cachedUrl);
      return cachedUrl;
    }
  }

  const configs = await fetchOssConfig();
  if (!configs.length) throw new Error("OSS config is empty");

  const delays = await Promise.all(configs.map((c) => testOssUrl(c.url)));
  let bestIndex = 0;
  let bestDelay = delays[0];
  for (let i = 1; i < delays.length; i++) {
    if (delays[i] < bestDelay) {
      bestDelay = delays[i];
      bestIndex = i;
    }
  }

  const { url, name } = configs[bestIndex];
  localStorage.setItem(CACHE_KEY, url);
  localStorage.setItem(CACHE_NAME_KEY, name);
  baseUrlPromise = Promise.resolve(url);
  return url;
}

export function getCurrentOssName(): string | null {
  return localStorage.getItem(CACHE_NAME_KEY);
}

export async function getOssBaseUrl(): Promise<string> {
  if (!baseUrlPromise) {
    baseUrlPromise = selectBestOssServer();
  }
  return baseUrlPromise;
}

export async function switchOssBaseUrl() {
  baseUrlPromise = null;
  const url = await selectBestOssServer(true);
  const name = getCurrentOssName();
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("oss-base-url-switched", { detail: { name, url } }),
    );
  }
  return url;
}
