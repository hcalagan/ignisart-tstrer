import { uploadJSONToIPFS } from "../lib/ipfs";

export interface PriceEntry {
  price: string;
  timestamp: string;
}

export interface PriceHistory {
  tokenId: string;
  history: PriceEntry[];
}

// Ambil data harga dari IPFS menggunakan CID
export async function fetchPriceHistory(cid: string): Promise<PriceHistory> {
  const uri = `https://ipfs.io/ipfs/${cid}`;
  try {
    const data = await fetch(uri).then((r) => r.json());
    return data;
  } catch {
    return { tokenId: "", history: [] };
  }
}

// Tambah entri harga baru dan upload ke IPFS
export async function addPriceEntry(latestHistory: PriceHistory, newPrice: string): Promise<string> {
  const newEntry: PriceEntry = { price: newPrice, timestamp: new Date().toISOString() };
  const updated: PriceHistory = {
    tokenId: latestHistory.tokenId,
    history: [...latestHistory.history, newEntry],
  };
  const cid = await uploadJSONToIPFS(updated);
  return cid;
}

// Hitung kenaikan harga dalam 7 hari terakhir
export function computePriceGain(history: PriceHistory): number {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const recent = history.history.filter(
    (e) => now - Date.parse(e.timestamp) <= weekMs
  );
  if (recent.length < 2) return 0;
  const sorted = recent.sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
  );
  const firstPrice = parseFloat(sorted[0].price);
  const lastPrice = parseFloat(sorted[sorted.length - 1].price);
  return firstPrice === 0 ? 0 : ((lastPrice - firstPrice) / firstPrice) * 100;
}
