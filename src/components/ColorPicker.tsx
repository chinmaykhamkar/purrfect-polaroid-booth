
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { scaleIn } from "@/lib/animations";

interface ColorPickerProps {
  onChange: (color: string) => void;
  selectedColor: string;
}

const ColorPicker = ({ onChange, selectedColor }: ColorPickerProps) => {
  const colors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Cream", value: "#FFF8E1" },
    { name: "Soft Pink", value: "#FFD6EC" },
    { name: "Pale Blue", value: "#D0E2FF" },
    { name: "Mint Green", value: "#D4F0DB" },
    { name: "Lavender", value: "#E5DEFF" },
    { name: "Coral", value: "#FF8A80" },
    { name: "Black", value: "#000000" },
  ];

  // Grid layout with 4 columns for larger screens, 4 for smaller screens
  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-soft border border-gray-100"
      {...scaleIn}
    >
      <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2 md:mb-3 font-cute">Frame Color</p>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <motion.button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
              selectedColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            style={{ backgroundColor: color.value }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Select ${color.name} color`}
          >
            {selectedColor === color.value && (
              <Check 
                className={`h-3 w-3 md:h-4 md:w-4 ${
                  ["#FFFFFF", "#FFF8E1", "#D0E2FF", "#D4F0DB", "#E5DEFF"].includes(color.value) 
                    ? "text-gray-800" 
                    : "text-white"
                }`} 
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ColorPicker;
