import { useAbstraxionAccount } from "../lib/xion";
import { fetchCommentData, updateCommentData } from "../lib/commentHelpers";
import React, { useState, useEffect } from "react";
import { translate } from "../lib/locale";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function LikeBuyButtons({
  tokenId,
  isForSale,
  price,
}: {
  tokenId: string;
  isForSale: boolean;
  price?: string;
}) {
  const { data: user } = useAbstraxionAccount();
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();
  const locale = router.locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";

  // Ambil bech32Address sebagai user address
  const userAddress = user?.bech32Address;

  useEffect(() => {
    (async () => {
      const data = await fetchCommentData(tokenId);
      setLikeCount(data.likes.length);
    })();
  }, [tokenId]);

  const handleLike = async () => {
    if (!userAddress) {
      toast.error(`${translate("login", locale)} dulu.`);
      return;
    }

    const data = await fetchCommentData(tokenId);
    if (data.likes.some((l) => l.user === userAddress)) return;

    const updated = {
      ...data,
      likes: [...data.likes, { user: userAddress, timestamp: new Date().toISOString() }],
    };
    await updateCommentData(tokenId, updated);
    setLikeCount(updated.likes.length);
    toast.success("Liked!");
  };

  const handleBuy = async () => {
    toast.info("Fitur pembelian segera hadir!");
  };

  return (
    <div className="flex space-x-1">
      <button
        onClick={handleLike}
        className="bg-white bg-opacity-75 dark:bg-gray-700 dark:bg-opacity-75 p-1 rounded-full hover:bg-opacity-100 dark:hover:bg-opacity-100 transition text-pink-500 text-xs"
      >
        ❤️ {likeCount}
      </button>
      {isForSale && price && (
        <button
          onClick={handleBuy}
          className="bg-yellow-200 dark:bg-yellow-700 p-1 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-600 transition text-yellow-800 dark:text-yellow-200 text-xs"
        >
          🛒
        </button>
      )}
    </div>
  );
}
