
import { motion } from "framer-motion";
import { Cat } from "lucide-react";
import { polaroidAnimation } from "@/lib/animations";

interface PolaroidFrameProps {
  image: string;
  color?: string;
  index: number;
}

const PolaroidFrame = ({ image, color = "#FFFFFF", index }: PolaroidFrameProps) => {
  const randomRotate = Math.random() * 6 - 3; // Random rotation between -3 and 3 degrees
  
  return (
    <motion.div
      className="polaroid inline-block relative cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10"
      style={{ backgroundColor: color, transform: `rotate(${randomRotate}deg)` }}
      {...polaroidAnimation}
      transition={{ 
        ...polaroidAnimation.transition, 
        delay: 0.2 + (index * 0.1) 
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        transition: { duration: 0.3 } 
      }}
    >
      <div className="relative">
        <img 
          src={image} 
          alt="Polaroid photo" 
          className="w-64 h-64 object-cover"
        />
        <div className="absolute bottom-2 right-2 opacity-50">
          <Cat className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div className="pt-3 pb-5 px-2 text-center">
        <p className="text-sm font-cute text-gray-600">Purrfect Moment</p>
      </div>
    </motion.div>
  );
};

export default PolaroidFrame;
