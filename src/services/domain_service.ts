export const ossDomain = "https://oss01.980410.xyz/pandaoss.conf.json";

import axios from "axios";

const CACHE_KEY = "oss_base_url";

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

let baseUrlPromise: Promise<string> | null = null;
export async function getOssBaseUrl(): Promise<string> {
  if (!baseUrlPromise) {
    baseUrlPromise = (async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return cached;
      const configs = await fetchOssConfig();
      if (!configs.length) {
        throw new Error("OSS config is empty");
      }
      const { url } = configs[Math.floor(Math.random() * configs.length)];
      localStorage.setItem(CACHE_KEY, url);
      return url;
    })();
  }
  return baseUrlPromise;
}
