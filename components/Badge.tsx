import React from "react";

export default function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${color || "bg-green-100 text-green-800"}`}
    >
      {label}
    </span>
  );
}