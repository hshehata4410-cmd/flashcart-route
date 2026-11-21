"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const gallery = images.filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = gallery[Math.min(selectedIndex, gallery.length - 1)];

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-sm text-gray-400">
        No image available
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
        <Image
          key={selected}
          src={selected}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((image, index) => {
            const active = index === Math.min(selectedIndex, gallery.length - 1);

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={active}
                className={[
                  "relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-gray-50 transition",
                  active
                    ? "border-primary-600"
                    : "border-gray-100 hover:border-gray-300",
                ].join(" ")}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
