/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAbstraxionContract } from "../lib/xion";
import FeedCard from "../components/FeedCard";
import { translate } from "../lib/locale";
import { useRouter } from "next/router";

export default function GalleryPage() {
  const [nfts, setNFTs] = useState([]);
  const router = useRouter();
  const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE } = router;
  const { queryContract } = useAbstraxionContract();

  useEffect(() => {
    (async () => {
      try {
        const result = await queryContract({
          contractAddress: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
          msg: { list_nfts: {} },
        });
        setNFTs(result || []);
      } catch (err) {
        console.error("Gagal fetch NFTs:", err);
      }
    })();
  }, [queryContract]);

  return (
    <div className="min-h-screen bg-ash">
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-flame dark:text-orange-400">{translate("gallery of whispers", locale || "en")}</h1>
        {nfts.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">{translate("no art yet", locale || "en")}</p>
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
