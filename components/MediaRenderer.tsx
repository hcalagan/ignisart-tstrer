import React from "react";
import Image from "next/image";

export default function MediaRenderer({
  mediaURI,
  mediaType,
}: {
  mediaURI: string;
  mediaType: "image" | "audio" | "video";
}) {
  const httpURI = mediaURI.replace("ipfs://", "https://ipfs.io/ipfs/");

  switch (mediaType) {
    case "image":
      return (
        <div className="w-full h-48 relative rounded-t-lg overflow-hidden">
          <Image
            src={httpURI}
            alt="Artwork"
            fill
            style={{ objectFit: "cover" }}
            sizes="100%"
          />
        </div>
      );
    case "audio":
      return (
        <audio controls className="w-full mt-2">
          <source src={httpURI} />
          Your browser does not support the audio element.
        </audio>
      );
    case "video":
      return (
        <video controls src={httpURI} className="w-full h-auto rounded-t-lg" />
      );
    default:
      return <p>Unsupported media type.</p>;
  }
}
