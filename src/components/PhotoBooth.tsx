
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Cat } from "lucide-react";
import { toast } from "sonner";
import { scaleIn, countAnimation, fadeIn } from "@/lib/animations";
import PolaroidFrame from "./PolaroidFrame";
import ColorPicker from "./ColorPicker";

const PhotoBooth = () => {
  const [isBoothActive, setIsBoothActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdownValue, setCountdownValue] = useState<null | number>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Function to start the camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsCameraReady(true);
            toast.success("Camera is ready!");
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };
  
  // Function to stop the camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraReady(false);
    }
  };
  
  // Function to capture a photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a data URL (base64 string)
        const photoUrl = canvas.toDataURL("image/jpeg");
        
        // Add the photo to the captured photos array
        setCapturedPhotos(prev => [...prev, photoUrl]);
        setCurrentPhotoIndex(prev => prev + 1);
        
        // Play a camera shutter sound
        const shutterSound = new Audio("/shutter.mp3");
        shutterSound.play().catch(err => console.log("Audio playback error:", err));
      }
    }
  };
  
  // Function to start the photobooth session
  const startPhotoSession = () => {
    setIsBoothActive(true);
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    startCamera();
  };
  
  // Function to close the photobooth
  const closePhotoBooth = () => {
    stopCamera();
    setIsBoothActive(false);
    setCountdownValue(null);
  };
  
  // Reset and take more photos
  const resetAndTakeMore = () => {
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    startCamera();
  };
  
  // Start countdown and take photos
  const startCountdown = () => {
    setCountdownValue(3);
    
    // Start the countdown
    const countdown = setInterval(() => {
      setCountdownValue(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Take the photo when countdown reaches 1
    setTimeout(() => {
      capturePhoto();
      
      // If we haven't taken 3 photos yet, start another countdown
      if (currentPhotoIndex < 2) {
        setTimeout(() => startCountdown(), 500);
      } else {
        // After the third photo, stop the camera
        setTimeout(() => stopCamera(), 1000);
      }
    }, 3000);
  };
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {!isBoothActive ? (
        <motion.div 
          className="text-center py-20"
          {...fadeIn}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Create Beautiful Memories with our{" "}
            <span className="text-primary">Purrfect</span> Polaroid Booth
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Take three perfect shots and get them instantly in adorable polaroid frames.
            Customize colors and create memories to cherish.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative inline-block"
          >
            <motion.div 
              className="absolute -top-8 -right-8 text-primary"
              animate={{ rotate: [0, 15, 0, 15, 0], y: [0, -5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
            >
              <Cat className="w-10 h-10" />
            </motion.div>
            
            <motion.button
              className="bg-primary text-white rounded-full px-8 py-4 text-lg font-medium flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/90"
              onClick={startPhotoSession}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-5 h-5" />
              Start Photo Booth
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="mt-20 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <img 
              src="/placeholder.svg" 
              alt="Sample polaroid" 
              className="w-64 h-80 object-cover rounded-sm shadow-polaroid transform rotate-[-3deg] bg-cream"
            />
            <img 
              src="/placeholder.svg" 
              alt="Sample polaroid" 
              className="w-64 h-80 object-cover rounded-sm shadow-polaroid transform rotate-[2deg] bg-softPink"
            />
            <img 
              src="/placeholder.svg" 
              alt="Sample polaroid" 
              className="w-64 h-80 object-cover rounded-sm shadow-polaroid transform rotate-[-1deg] bg-paleBlue"
            />
          </motion.div>
        </motion.div>
      ) : (
        <div className="relative">
          <motion.div 
            className="absolute top-4 right-4 z-10"
            {...scaleIn}
          >
            <button 
              onClick={closePhotoBooth}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
              aria-label="Close photo booth"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {capturedPhotos.length < 3 ? (
              <motion.div 
                key="camera" 
                className="relative bg-black rounded-2xl overflow-hidden shadow-lg"
                {...scaleIn}
              >
                <div className="relative">
                  <video 
                    ref={videoRef} 
                    className="w-full max-h-[70vh] rounded-2xl"
                    autoPlay 
                    playsInline
                    muted
                  />
                  
                  <AnimatePresence>
                    {countdownValue !== null && (
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                        {...fadeIn}
                      >
                        <motion.div
                          key={`countdown-${countdownValue}`}
                          className="text-6xl font-bold text-white font-display"
                          {...countAnimation}
                        >
                          {countdownValue}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-white">
                      <h3 className="text-lg font-medium font-cute">Photo {currentPhotoIndex + 1} of 3</h3>
                      <p className="text-white/70 text-sm">
                        {capturedPhotos.length === 0 
                          ? "Get ready for your first shot!" 
                          : `${3 - capturedPhotos.length} more to go!`}
                      </p>
                    </div>
                    
                    {isCameraReady && countdownValue === null && (
                      <motion.button
                        onClick={startCountdown}
                        className="bg-white text-black px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg hover:bg-white/90 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={countdownValue !== null}
                      >
                        <Camera className="w-5 h-5" />
                        {capturedPhotos.length === 0 ? "Take Photo" : "Next Photo"}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results" 
                className="py-10 bg-gray-50 rounded-2xl"
                {...fadeIn}
              >
                <div className="max-w-4xl mx-auto text-center">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-display mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Your Purrfect Polaroids!
                  </motion.h2>
                  
                  <motion.p 
                    className="text-muted-foreground mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Customize your frame color and download your memories
                  </motion.p>
                  
                  <div className="mb-8">
                    <ColorPicker 
                      selectedColor={selectedColor} 
                      onChange={setSelectedColor} 
                    />
                  </div>
                  
                  <motion.div 
                    className="flex flex-wrap justify-center gap-6 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: a0.3 }}
                  >
                    {capturedPhotos.map((photo, index) => (
                      <PolaroidFrame 
                        key={index}
                        image={photo}
                        color={selectedColor}
                        index={index}
                      />
                    ))}
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <button
                      onClick={resetAndTakeMore}
                      className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Take More Photos
                    </button>
                    
                    <button
                      onClick={() => {
                        toast.success("Photos downloaded successfully!");
                      }}
                      className="px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
                    >
                      Download All
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PhotoBooth;
