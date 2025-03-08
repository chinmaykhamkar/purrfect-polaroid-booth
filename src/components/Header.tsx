
import { motion } from "framer-motion";
import { Camera, Cat } from "lucide-react";
import { slideDown } from "@/lib/animations";

const Header = () => {
  return (
    <motion.header 
      className="w-full py-6 px-8 flex justify-between items-center"
      {...slideDown}
    >
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Cat className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-display tracking-tight">Purrfect Polaroid</h1>
      </motion.div>

      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <a 
          href="#" 
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Gallery
        </a>
        <a 
          href="#" 
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          About
        </a>
        <a 
          href="#" 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full transition-all duration-200 hover:shadow-md hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
          <span>Start Booth</span>
        </a>
      </motion.div>
    </motion.header>
  );
};

export default Header;
