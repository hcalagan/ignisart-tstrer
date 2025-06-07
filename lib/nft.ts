export type NFT = {
  tokenId: string;
  metadata: {
    name: string;
    description?: string;
    mediaURI: string; // IPFS CID or gateway URL
    mediaType: "image" | "audio" | "video";
    tags?: string[];
    price?: string;
  };
  isForSale?: boolean;
};
