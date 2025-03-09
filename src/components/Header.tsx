import { motion } from "framer-motion";
import { Camera, Cat, Github } from "lucide-react";
import { slideDown } from "@/lib/animations";

const Header = () => {
  return (
    <motion.header 
      className="w-full py-4 md:py-6 px-4 md:px-8 flex justify-between items-center"
      {...slideDown}
    >
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Cat className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-display tracking-tight">Purrfect Polaroid</h1>
      </motion.div>

      <motion.div 
        className="flex items-center gap-2 md:gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <a 
          href="https://github.com/chinmaykhamkar/purrfect-polaroid-booth" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-full transition-all duration-200 hover:shadow-md hover:bg-primary/90"
        >
          <Github className="h-4 w-4 md:h-5 md:w-5"/>
        </a>
      </motion.div>
    </motion.header>
  );
};

export default Header;

