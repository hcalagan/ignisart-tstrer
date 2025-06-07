import { uploadJSONToIPFS } from "./ipfs";

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  parentId?: string;
}

export interface LikeEntry {
  user: string;
  timestamp: string;
}

export interface CommentData {
  tokenId: string;
  comments: Comment[];
  likes: LikeEntry[];
}

export async function fetchCommentData(tokenId: string): Promise<CommentData> {
  const uri = `ipfs://comments_${tokenId}`;
  try {
    const data = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/")).then((r) => r.json());
    return data;
  } catch {
    return { tokenId, comments: [], likes: [] };
  }
}

export async function updateCommentData(tokenId: string, updated: CommentData) {
  const newURI = await uploadJSONToIPFS(updated);
  return newURI;
}