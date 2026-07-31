// Phone camera photos routinely run 8-15 MB, which is what pushes the
// documents upload request over any request-body limit. Downscaling and
// re-encoding as JPEG client-side shrinks that by an order of magnitude
// before the file ever leaves the browser. PDFs and other non-image files
// pass through untouched — canvas can't re-encode those.
const MAX_DIMENSION = 2000
const JPEG_QUALITY = 0.8

export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file

  try {
    const image = await loadImage(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))
    if (scale === 1 && file.type === "image/jpeg") return file

    const width = Math.round(image.naturalWidth * scale)
    const height = Math.round(image.naturalHeight * scale)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.drawImage(image, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY))
    // Some already-optimized images can come back larger after re-encoding —
    // keep the original in that case instead of penalizing the user for it.
    if (!blob || blob.size >= file.size) return file

    return new File([blob], replaceExtension(file.name, "jpg"), { type: "image/jpeg", lastModified: file.lastModified })
  } catch {
    // A corrupt/undecodable image (or an environment without canvas support)
    // falls back to the original file rather than blocking the upload.
    return file
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = (error) => {
      URL.revokeObjectURL(url)
      reject(error)
    }
    image.src = url
  })
}

function replaceExtension(name: string, ext: string): string {
  return `${name.replace(/\.[^./]+$/, "")}.${ext}`
}
