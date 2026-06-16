export function generateBlurPlaceholder(width = 8, height = 8): string {
  // Simple SVG blur placeholder - a warm neutral color matching the site theme
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect fill="#e8e4dc" width="${width}" height="${height}"/></svg>`;
  return `data:image/svg+xml;base64,${typeof Buffer !== "undefined" ? Buffer.from(svg).toString("base64") : btoa(svg)}`;
}
