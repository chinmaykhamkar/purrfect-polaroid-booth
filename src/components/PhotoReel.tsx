
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Cat } from "lucide-react";
import { polaroidAnimation } from "@/lib/animations";

interface PhotoReelProps {
  photos: string[];
  color: string;
}

const PhotoReel = ({ photos, color }: PhotoReelProps) => {
  const today = format(new Date(), "MMMM d, yyyy");
  const fixedRotate = 20; // Fixed subtle rotation of 1.5 degrees
  
  // Animation for photos dropping from above with a more realistic feel
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: -200,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        mass: 1.2, // Increased mass for slower movement
        damping: 15, // Increased damping for less bouncy effect
        stiffness: 80, // Reduced stiffness for slower movement
        duration: 1.8, // Longer duration
        ease: "easeOut",
        when: "beforeChildren"
      }
    }
  };
  
  return (
    <motion.div
      className="relative w-72 md:w-80 mx-auto overflow-hidden p-4 shadow-xl rounded-sm"
      style={{ 
        backgroundColor: color, 
        transform: `rotate(${fixedRotate}deg)`,
        transformOrigin: "center"
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <div>
        {photos.map((photo, index) => (
          <div 
            key={index}
            className="mb-2 last:mb-0 relative"
          >
            <img 
              src={photo} 
              alt={`Photo ${index + 1}`}
              className="w-full h-64 md:h-72 object-cover border border-gray-100"
              style={{ aspectRatio: "1/1" }}
            />
          </div>
        ))}
        
        <div className="mt-3 mb-1 text-center">
          <p className="text-sm font-cute text-gray-600">{today}</p>
        </div>
      </div>
      
      <div className="absolute bottom-3 right-3 opacity-60">
        <Cat className="w-4 h-4 text-gray-600" />
      </div>
    </motion.div>
  );
};

export default PhotoReel;
