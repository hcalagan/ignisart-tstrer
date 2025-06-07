import { uploadJSONToIPFS } from "./ipfs";

export interface PriceEntry {
  price: string;
  timestamp: string;
}

export interface PriceHistory {
  tokenId: string;
  history: PriceEntry[];
}

export async function fetchPriceHistory(tokenId: string): Promise<PriceHistory> {
  const uri = `ipfs://price_${tokenId}`;
  try {
    const data = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/")).then((r) => r.json());
    return data;
  } catch {
    return { tokenId, history: [] };
  }
}

export async function addPriceEntry(tokenId: string, price: string) {
  const existing = await fetchPriceHistory(tokenId);
  const newEntry: PriceEntry = { price, timestamp: new Date().toISOString() };
  const updated: PriceHistory = { tokenId, history: [...existing.history, newEntry] };
  const uri = await uploadJSONToIPFS(updated);
  return uri;
}

export function computePriceGain(history: PriceHistory): number {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const recent = history.history.filter((e) => now - Date.parse(e.timestamp) <= weekMs);
  if (recent.length < 2) return 0;
  const sorted = recent.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  const firstPrice = parseFloat(sorted[0].price);
  const lastPrice = parseFloat(sorted[sorted.length - 1].price);
  return firstPrice === 0 ? 0 : ((lastPrice - firstPrice) / firstPrice) * 100;
}