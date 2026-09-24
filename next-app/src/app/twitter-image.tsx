import { OG_IMAGE_SIZE, renderSiteOgImage } from "@/lib/og-image";

export const alt = "Brandon Sanders, CISSP - IT Security Leader & Manager";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderSiteOgImage();
}
