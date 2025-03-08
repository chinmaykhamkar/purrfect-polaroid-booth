
import html2canvas from "html2canvas";

export const downloadPhotoReel = async (reelRef: React.RefObject<HTMLDivElement>) => {
  if (!reelRef.current) return;
  
  try {
    const canvas = await html2canvas(reelRef.current, {
      scale: 2, // Higher quality
      backgroundColor: null,
      logging: false
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
