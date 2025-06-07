/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAbstraxionContract } from "../../lib/xion";
import MediaRenderer from "../../components/MediaRenderer";
import CommentSection from "../../components/CommentSection";
import LikeBuyButtons from "../../components/LikeBuyButtons";
import { translate } from "../../lib/locale";
import { addPriceEntry } from "../../lib/priceHistoryHelpers";

export default function ArtDetailPage() {
  const router = useRouter();
  const tokenId = typeof router.query.tokenId === "string" ? router.query.tokenId : "";
  const locale = router.locale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";

  const { executeContract } = useAbstraxionContract();
  const [nft, setNFT] = useState<any>(null);
  const [price, setPrice] = useState("");
  const [isListing, setIsListing] = useState(false);

  useEffect(() => {
    if (!tokenId) return;

    (async () => {
      try {
        const result = await executeContract({
          contractAddress: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
          msg: { get_nft: { token_id: tokenId } },
        });

        setNFT(result ?? null);
      } catch (err) {
        console.error("Failed to fetch NFT:", err);
        setNFT(null);
      }
    })();
  }, [tokenId, executeContract]);

  const handleListForSale = async () => {
    if (!price.trim() || isNaN(parseFloat(price))) {
      alert("Please enter a valid price.");
      return;
    }

    setIsListing(true);
    try {
      await executeContract({
        contractAddress: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
        msg: {
          list_for_sale: {
            token_id: tokenId,
            price: price,
          },
        },
      });

      await addPriceEntry(tokenId, price);
      alert(translate("list for sale", locale));
      router.reload();
    } catch (error: any) {
      alert(`Failed to list NFT: ${error.message}`);
    } finally {
      setIsListing(false);
    }
  };

  if (!nft)
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {translate("loading", locale)}
      </p>
    );

  return (
    <div className="min-h-screen bg-ash">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-flame dark:text-orange-400">
          {translate("art detail", locale)}
        </h1>
        <div className="mt-4 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <MediaRenderer
              mediaURI={nft.metadata.mediaURI}
              mediaType={nft.metadata.mediaType}
            />
          </div>
          <div className="flex-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {nft.metadata.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {nft.metadata.description || "No description."}
            </p>
            {nft.metadata.tags && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {nft.metadata.tags.map((t: string) => (
                  <span key={t} className="mr-1">
                    #{t}
                  </span>
                ))}
              </p>
            )}
            {nft.isForSale && nft.metadata.price && (
              <p className="text-sm text-red-500 dark:text-red-400">
                Price: {nft.metadata.price} USDC
              </p>
            )}
            <LikeBuyButtons
              tokenId={tokenId}
              isForSale={nft.isForSale}
              price={nft.metadata?.price}
            />
            {!nft.isForSale && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={translate("enter price in USDC", locale)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flame text-sm"
                />
                <button
                  onClick={handleListForSale}
                  disabled={isListing}
                  className={`w-full px-4 py-2 text-white rounded-lg transition text-sm ${
                    isListing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-flame hover:bg-orange-600"
                  }`}
                >
                  {isListing
                    ? translate("processing", locale)
                    : translate("list for sale", locale)}
                </button>
              </div>
            )}
          </div>
        </div>
        <CommentSection tokenId={tokenId} />
      </main>
    </div>
  );
}
