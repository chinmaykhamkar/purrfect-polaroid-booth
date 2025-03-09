import html2canvas from "html2canvas";

export const downloadPhotoReel = async (reelRef: React.RefObject<HTMLDivElement>) => {
  if (!reelRef.current) return false;
  
  try {
    // Find the download container
    const container = reelRef.current.querySelector('.download-container');
    if (!container) return false;
    
    // Calculate the actual container height including all content
    const actualHeight = container.scrollHeight;
    
    const canvas = await html2canvas(container, {
      scale: 2, // Higher quality
      backgroundColor: null,
      logging: false,
      height: actualHeight,
      useCORS: true,
      imageTimeout: 0,
      allowTaint: true
    });
    
    const image = canvas.toDataURL("image/png");
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