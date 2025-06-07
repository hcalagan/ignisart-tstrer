/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAbstraxionContract } from "../lib/xion";
import FeedCard from "../components/FeedCard";
import { translate } from "../lib/locale";

export default function SearchPage() {
  const router = useRouter();
  const { query: { query } } = router;
  const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE } = router;
  const { queryContract } = useAbstraxionContract();
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    if (!query) return;
    (async () => {
      try {
        const result = await queryContract({
          contractAddress: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
          msg: { search_nfts: { query: query.toString() } },
        });
        setNFTs(result || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    })();
  }, [query, queryContract]);

  return (
    <div className="min-h-screen bg-ash">
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-flame dark:text-orange-400">Search: &quot;{query}&quot;</h1>
        {nfts.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">{translate("no results", locale || "en")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft: any) => (
              <FeedCard
                key={nft.tokenId}
                tokenId={nft.tokenId}
                metadata={nft.metadata}
                isForSale={nft.isForSale}
                price={nft.metadata?.price}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
