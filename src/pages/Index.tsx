
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PhotoBooth from "@/components/PhotoBooth";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container px-4 py-6 md:py-12">
        <PhotoBooth />
      </main>
      
      <motion.footer 
        className="mt-20 py-10 border-t border-gray-200 text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} Purrfect Polaroid Booth. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
