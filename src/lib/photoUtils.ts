import html2canvas from "html2canvas";

export const downloadPhotoReel = async (reelRef: React.RefObject<HTMLDivElement>) => {
  if (!reelRef.current) return false;
  
  try {
    // Find the download container
    const container = reelRef.current.querySelector('.download-container');
    if (!container) return false;
    
    // Higher scale for better quality
    const scale = 3; // Increased from 2 to 3 for better quality
    
    const canvas = await html2canvas(container, {
      scale: scale, // Higher quality
      backgroundColor: null,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      // Remove width and height constraints to capture at native resolution
      onclone: (documentClone, element) => {
        // Find all images in the cloned element and make sure they're loaded
        const images = element.querySelectorAll('img');
        images.forEach(img => {
          // Force image to be fully loaded before capture
          if (img.complete) return;
          img.onload = null; // Remove existing onload handlers
          // Optionally set crossOrigin attribute if needed
          if (img.src.startsWith('http')) {
            img.crossOrigin = 'Anonymous';
          }
        });
      }
    });
    
    // Create a high-quality PNG
    const imageType = 'image/png';
    const imageQuality = 1.0; // Maximum quality
    const image = canvas.toDataURL(imageType, imageQuality);
    
    const link = document.createElement("a");
    link.href = image;
    link.download = `purrfect-polaroid-${new Date().toISOString().split("T")[0]}.png`;
    link.click();
    
    return true;
  } catch (error) {
    console.error("Error generating photo reel:", error);
    return false;
  }
};