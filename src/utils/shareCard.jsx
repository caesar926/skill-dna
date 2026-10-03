import html2canvas from 'html2canvas'

// Screenshots a DOM element (the .player-scorecard section) and returns a
// PNG Blob — whatever the card actually looks like on screen is exactly
// what gets shared, so it never drifts out of sync with design changes.
export async function generateShareCard(cardElement) {
  const canvas = await html2canvas(cardElement, {
    backgroundColor: '#161b22',
    useCORS: true,
    scale: 2, // sharper image for sharing/downloading
  })

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}
