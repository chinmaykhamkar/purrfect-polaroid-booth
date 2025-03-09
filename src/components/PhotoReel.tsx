
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Cat } from "lucide-react";

interface PhotoReelProps {
  photos: string[];
  color: string;
}

const PhotoReel = ({ photos, color }: PhotoReelProps) => {
  const today = format(new Date(), "MMMM d, yyyy");
  const randomRotate = Math.random() * 4 - 2; // Random rotation between -2 and 2 degrees
  
  // Animation for photos dropping from above
  const containerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren"
      }
    }
  };
  
  return (
    <motion.div
      className="relative w-72 md:w-80 mx-auto bg-white p-4 shadow-xl"
      style={{ backgroundColor: "#fff" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{ 
          backgroundColor: color,
          transform: `rotate(${randomRotate}deg)`,
          transformOrigin: "center" 
        }}
        whileHover={{ rotate: 0, transition: { duration: 0.3 } }}
      >
        <div className="p-2">
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
    </motion.div>
  );
};

export default PhotoReel;
