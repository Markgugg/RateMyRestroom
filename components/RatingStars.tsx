"use client";

import { useState } from "react";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export default function RatingStars({ value, onChange, readonly = false, size = "md" }: Props) {
  const [hover, setHover] = useState(0);
  const starSize = size === "sm" ? "text-base" : "text-2xl";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (readonly ? value : (hover || value)) >= n;
        return (
          <button
            key={n}
            type="button"
            disabled={readonly}
            className={`${starSize} transition-colors ${filled ? "text-yellow-400" : "text-gray-300"} ${!readonly ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
            onClick={() => !readonly && onChange?.(n)}
            onMouseEnter={() => !readonly && setHover(n)}
            onMouseLeave={() => !readonly && setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
