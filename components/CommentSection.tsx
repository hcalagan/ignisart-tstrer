import React, { useState, useEffect, JSX } from "react";
import { useAbstraxionAccount } from "../lib/xion";
import {
  fetchCommentData,
  updateCommentData,
  Comment,
  CommentData,
} from "../lib/commentHelpers";
import { translate } from "../lib/locale";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function CommentSection({ tokenId }: { tokenId: string }) {
  const { data: user } = useAbstraxionAccount();
  const [data, setData] = useState<CommentData | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const router = useRouter();
  const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE } = router;

  useEffect(() => {
    (async () => {
      try {
        const cd = await fetchCommentData(tokenId);
        setData(cd);
      } catch (error) {
        console.error("Failed to fetch comment data:", error);
        toast.error("Gagal memuat komentar.");
      }
    })();
  }, [tokenId]);

  if (!data)
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {translate("loading", locale || "en")}
      </p>
    );

  const handleAddComment = async () => {
    if (!user) {
      toast.error(`${translate("login", locale || "en")} dulu.`);
      return;
    }
    if (!newComment.trim()) return;

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const commentObj: Comment = {
      id,
      author: user.bech32Address, // ✅ PAKAI bech32Address
      content: newComment,
      timestamp: new Date().toISOString(),
      parentId: replyTo || undefined,
    };

    const updated: CommentData = {
      ...data,
      comments: [...data.comments, commentObj],
    };

    try {
      await updateCommentData(tokenId, updated);
      setData(updated);
      setNewComment("");
      setReplyTo(null);
      toast.success("Comment posted!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan komentar.");
    }
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
  };

  const renderComments = (
    parentId: string | null = null,
    level = 0
  ): JSX.Element[] =>
    data.comments
      .filter((c) => (parentId === null ? !c.parentId : c.parentId === parentId))
      .map((c) => (
        <div key={c.id} className={`pl-${level * 4} mb-2`}>
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">
                {c.author.slice(0, 6)}…
              </span>{" "}
              – {new Date(c.timestamp).toLocaleString()}
            </p>
            <p className="text-sm dark:text-gray-200">{c.content}</p>
            <button
              onClick={() => handleReply(c.id)}
              className="text-xs text-flame dark:text-orange-400 hover:underline mt-1"
            >
              {translate("reply", locale || "en")}
            </button>
          </div>
          {renderComments(c.id, level + 1)}
        </div>
      ));

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {translate("comments & discussion", locale || "en")}
      </h3>
      <div>{renderComments()}</div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder={
          replyTo
            ? translate("write a reply", locale || "en")
            : translate("write a comment", locale || "en")
        }
        rows={replyTo ? 2 : 3}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm"
      />
      {replyTo && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Replying to comment ID: {replyTo}
        </p>
      )}
      <button
        onClick={handleAddComment}
        className="px-3 py-1 bg-flame dark:bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
      >
        {replyTo ? translate("post reply", locale || "en") : translate("post comment", locale || "en")}
      </button>
    </div>
  );
}
