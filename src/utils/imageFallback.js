/**
 * Generate a safe fallback image as data URI
 * This prevents infinite loops from external placeholder services
 */
export const getImageFallback = (text = 'No Image', width = 400, height = 300) => {
  // Create a simple SVG as data URI
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `.trim()
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Handle image error with safe fallback
 * Prevents infinite loops by checking if already using fallback
 */
export const handleImageError = (e, fallbackText = 'No Image') => {
  // Prevent infinite loop - if already a data URI, don't retry
  if (e.target.src && e.target.src.startsWith('data:')) {
    e.target.style.display = 'none'
    return
  }
  
  // Set fallback only once
  if (!e.target.dataset.fallbackSet) {
    e.target.src = getImageFallback(fallbackText)
    e.target.dataset.fallbackSet = 'true'
  } else {
    // If fallback also fails, hide the image
    e.target.style.display = 'none'
  }
}

