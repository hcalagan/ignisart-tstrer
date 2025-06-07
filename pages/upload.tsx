/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAbstraxionAccount, useAbstraxionContract } from "../lib/xion";
import { uploadToIPFS, uploadJSONToIPFS } from "../lib/ipfs";
import LoginButton from "../components/LoginButton";
import { translate } from "../lib/locale";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function UploadPage() {
  const { data: account } = useAbstraxionAccount();
  const { executeContract } = useAbstraxionContract();
  const router = useRouter();
  const locale = router.locale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "audio" | "video">("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setMediaType(
        selectedFile.type.startsWith("image") ? "image" :
        selectedFile.type.startsWith("audio") ? "audio" : "video"
      );
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!account?.bech32Address) {
      toast.error(translate("please login to upload", locale));
      return;
    }
    if (!file || !title.trim()) {
      toast.error("Please provide a file and title.");
      return;
    }

    setIsMinting(true);
    try {
      const mediaURI = await uploadToIPFS(file);
      const metadata = {
        name: title,
        description,
        [mediaType === "image" ? "image" : mediaType === "video" ? "animation_url" : "audio"]: mediaURI,
        tags: tags.split(",").map((t) => t.trim()).filter((t) => t),
      };
      const metadataURI = await uploadJSONToIPFS(metadata);

      const response = await executeContract({
        contractAddress: process.env.NEXT_PUBLIC_TREASURY_CONTRACT!,
        msg: {
          mint: {
            to: account.bech32Address,
            token_uri: metadataURI,
          },
        },
      });

      toast.success("NFT minted successfully!");
      // Fallback jika tidak ada tokenId, redirect ke homepage
      if ((response as any)?.tokenId) {
        router.push(`/art/${(response as any).tokenId}`);
      } else {
        router.push("/");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to mint NFT: ${msg}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ash">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-flame dark:text-orange-400">
          {translate("upload art", locale)}
        </h1>

        {!account?.bech32Address ? (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {translate("please login to upload", locale)}
            </p>
            <div className="mt-4">
              <LoginButton />
            </div>
          </div>
        ) : (
          <div className="mt-4 w-full max-w-md mx-auto">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Art File (PNG, MP3, MP4, WAV)</span>
                <input
                  type="file"
                  accept="image/*,audio/mp3,audio/wav,video/mp4"
                  onChange={handleFileChange}
                  className="mt-2 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">{translate("art title", locale)}</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-flame"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">{translate("art description", locale)}</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-flame"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">{translate("tags", locale)} (comma-separated)</span>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-flame"
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={isMinting}
                className={`mt-4 w-full px-4 py-2 text-white rounded-lg transition text-sm ${isMinting ? "bg-gray-400 cursor-not-allowed" : "bg-flame hover:bg-orange-600"}`}
              >
                {isMinting ? translate("processing", locale) : translate("mint gasless", locale)}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
