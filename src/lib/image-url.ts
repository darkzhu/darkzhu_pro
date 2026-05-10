export function normalizeImageUrl(value?: string | null) {
  const imageUrl = value?.trim();

  if (!imageUrl) {
    return "";
  }

  if (/^(?:https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl.replace(/^public\//, "")}`;
}
