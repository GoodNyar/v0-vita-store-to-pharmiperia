"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

export const CATALOG_PLACEHOLDER_SRC = "/placeholder.svg"

type CatalogImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null | undefined
}

export function CatalogImage({ src, alt, ...props }: CatalogImageProps) {
  const initialSrc = src?.trim() ? src : CATALOG_PLACEHOLDER_SRC
  const [resolvedSrc, setResolvedSrc] = useState(initialSrc)

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (resolvedSrc !== CATALOG_PLACEHOLDER_SRC) {
          setResolvedSrc(CATALOG_PLACEHOLDER_SRC)
        }
      }}
    />
  )
}