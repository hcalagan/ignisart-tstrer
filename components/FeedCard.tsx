import Link from "next/link";
import MediaRenderer from "./MediaRenderer";
import LikeBuyButtons from "./LikeBuyButtons";
// import { PriceHistory } from "./PriceHistory"; // ❌ Komentar karena belum ada komponen
import { useRouter } from "next/router";

export default function FeedCard({
  tokenId,
  metadata,
  isForSale,
  price,
}: {
  tokenId: string;
  metadata: {
    name: string;
    description?: string;
    mediaURI: string;
    mediaType: "image" | "audio" | "video";
    tags?: string[];
  };
  isForSale?: boolean;
  price?: string;
}) {
  const router = useRouter();
  const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE } = router;

  return (
    <Link href={`/art/${tokenId}`} locale={locale}>
      <a className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative h-full flex flex-col">
        <MediaRenderer mediaURI={metadata.mediaURI} mediaType={metadata.mediaType} />
        <div className="p-2 flex-grow">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{metadata.name}</h3>
          {metadata.tags && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {metadata.tags.map((t) => (
                <span key={t} className="mr-1">#{t}</span>
              ))}
            </p>
          )}
          {isForSale && price && (
            <p className="text-xs text-red-500 dark:text-red-400">Price: {price} USD</p>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <LikeBuyButtons tokenId={tokenId} isForSale={Boolean(isForSale)} price={price} />
        </div>
        {/* <div className="absolute bottom-2 left-2">
          <PriceHistory tokenId={tokenId} />
        </div> */}
      </a>
    </Link>
  );
}
