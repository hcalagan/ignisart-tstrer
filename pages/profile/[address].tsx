/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAbstraxionContract } from "../../lib/xion";
import FeedCard from "../../components/FeedCard";
import { translate } from "../../lib/locale";

interface NFT {
  tokenId: string;
  metadata: any;
  isForSale: boolean;
}

interface Profile {
  name: string;
  bio: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const address = typeof router.query.address === "string" ? router.query.address : "";
  const locale = router.locale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";

  const { queryContract } = useAbstraxionContract();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nfts, setNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    if (!address) return;

    (async () => {
      try {
        // Ambil NFT yang dimiliki
        const response = await queryContract({
          contractAddress: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
          msg: { list_nfts: { owner: address } },
        });

        setNFTs(response || []);

        // Ambil profil dari metadata NFT pertama yang tersedia
        const profileNFT = response.find((nft: any) => nft.metadata?.profile_cid);
        if (profileNFT?.metadata?.profile_cid) {
          const res = await fetch(`https://ipfs.io/ipfs/${profileNFT.metadata.profile_cid}`);
          const json = await res.json();
          setProfile(json);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setProfile(null);
      }
    })();
  }, [address, queryContract]);

  return (
    <div className="min-h-screen bg-ash">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-flame dark:text-orange-400">{translate("artist profile", locale)}</h1>

        {profile ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{profile.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profile.bio || "No bio provided."}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{translate("no profile", locale)}</p>
        )}

        <h3 className="mt-6 text-lg font-medium text-gray-800 dark:text-gray-100">{translate("artworks", locale)}</h3>
        {nfts.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">{translate("no art yet", locale)}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {nfts.map((nft) => (
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
