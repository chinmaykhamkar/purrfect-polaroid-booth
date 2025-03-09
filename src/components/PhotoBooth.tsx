import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Download, Loader2, Cat } from "lucide-react";
import { toast } from "sonner";
import { scaleIn, countAnimation, fadeIn } from "@/lib/animations";
import { downloadPhotoReel } from "@/lib/photoUtils";
import ColorPicker from "./ColorPicker";
import PhotoReel from "./PhotoReel";

const PhotoBooth = () => {
  const [isBoothActive, setIsBoothActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdownValue, setCountdownValue] = useState<null | number>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [isDownloading, setIsDownloading] = useState(false);
  // Track if the photo sequence has been started by the user
  const [hasStartedPhotoSequence, setHasStartedPhotoSequence] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const photoReelRef = useRef<HTMLDivElement>(null);

  const startCamera = async () => {
    try {
      // Stop any existing camera stream first
      stopCamera();

      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: window.innerWidth < 768 ? 720 : 1280 },
          height: { ideal: window.innerWidth < 768 ? 1280 : 720 }
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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        // First, clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save the current transform
        context.save();
        
        // Flip the canvas horizontally to counter the mirrored view
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        
        // Draw the video frame to the canvas (now unmirrored)
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Restore the transform
        context.restore();

        const photoUrl = canvas.toDataURL("image/jpeg");
        
        setCapturedPhotos(prev => [...prev, photoUrl]);
        setCurrentPhotoIndex(prev => prev + 1);

        const shutterSound = new Audio("/shutter.mp3");
        shutterSound.play().catch(err => console.log("Audio playback error:", err));
      }
    }
  };

  const startPhotoSession = () => {
    setIsBoothActive(true);
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    setHasStartedPhotoSequence(false); // Reset this flag when starting a new session
    startCamera();
  };

  const closePhotoBooth = () => {
    stopCamera();
    // Refresh the page when closing the photo booth
    window.location.reload();
  };

  const startCountdown = () => {
    // When this function is called the first time, set the hasStartedPhotoSequence flag
    if (!hasStartedPhotoSequence) {
      setHasStartedPhotoSequence(true);
    }
    
    setCountdownValue(3);

    const countdown = setInterval(() => {
      setCountdownValue(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      capturePhoto();
      
      // Check if we need to take more photos (we want 3 total)
      if (currentPhotoIndex < 2) {
        // Automatically start the next countdown after a short delay
        setTimeout(() => startCountdown(), 1000);
      } else {
        // After third photo, stop the camera
        setTimeout(() => stopCamera(), 1000);
      }
    }, 3000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const success = await downloadPhotoReel(photoReelRef);
    setIsDownloading(false);

    if (success) {
      toast.success("Photo reel downloaded successfully!");
    } else {
      toast.error("Failed to download photos. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto relative px-4">
      {!isBoothActive ? (
        <motion.div
          className="text-center py-10 md:py-20"
          {...fadeIn}
        >
          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto leading-tight font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Create Beautiful Memories with our{" "}
            <span className="text-primary">Purrfect</span> Polaroid Booth
          </motion.h2>

          <motion.p
            className="text-base md:text-xl text-muted-foreground mb-6 md:mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Take three perfect shots and get them instantly in an adorable polaroid reel.
            Customize colors and create memories to cherish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative inline-block"
          >
            <motion.div
              className="absolute -top-6 -right-6 md:-top-8 md:-right-8 text-primary"
              animate={{ rotate: [0, 15, 0, 15, 0], y: [0, -5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
            >
              <Cat className="w-8 h-8 md:w-10 md:h-10" />
            </motion.div>

            <motion.button
              className="bg-primary text-white rounded-full px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/90"
              onClick={startPhotoSession}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
              Start Photo Booth
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-12 md:mt-20 flex flex-wrap justify-center gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <motion.div
              className="w-56 md:w-64 relative"
              initial={{ y: 50, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: 5 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <img
                src={"/public/img/cat1.jpg"}
                alt="Sample polaroid"
                className="w-full h-auto object-cover rounded-sm shadow-polaroid bg-cream"
              />
            </motion.div>
            <motion.div
              className="w-56 md:w-64 relative"
              initial={{ y: 50, opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <img
                src={"/public/img/cat3.jpg"}
                alt="Sample polaroid"
                className="w-full h-auto object-cover rounded-sm shadow-polaroid bg-cream"
              />
            </motion.div>
            <motion.div
              className="w-56 md:w-64 relative"
              initial={{ y: 50, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: -5 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <img
                src={"/public/img/cat4.jpg"}
                alt="Sample polaroid"
                className="w-full h-auto object-cover rounded-sm shadow-polaroid bg-cream"
              />
            </motion.div>
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
              <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
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
                    className="w-full max-h-[70vh] rounded-2xl object-cover"
                    style={{ transform: "scaleX(-1)" }} 
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
                          className="text-5xl md:text-6xl font-bold text-white font-display"
                          {...countAnimation}
                        >
                          {countdownValue}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-white">
                      <h3 className="text-base md:text-lg font-medium font-cute">Photo {currentPhotoIndex + 1} of 3</h3>
                      <p className="text-white/70 text-xs md:text-sm">
                        {capturedPhotos.length === 0
                          ? "Get ready for your first shot!"
                          : `${3 - capturedPhotos.length} more to go!`}
                      </p>
                    </div>

                    {isCameraReady && countdownValue === null && !hasStartedPhotoSequence && (
                      <motion.button
                        onClick={startCountdown}
                        className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center gap-2 text-sm md:text-base font-medium shadow-lg hover:bg-white/90 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={countdownValue !== null}
                      >
                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                        Take Photo
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                className="py-8 md:py-10 bg-gray-50 rounded-2xl"
                {...fadeIn}
              >
                <div className="max-w-md mx-auto text-center px-4">
                  <motion.h2
                    className="text-2xl md:text-3xl font-display mb-3 md:mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Your Purrfect Polaroid!
                  </motion.h2>

                  <motion.p
                    className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Customize your frame color and download your photo reel
                  </motion.p>

                  <div className="mb-6 md:mb-8">
                    <ColorPicker
                      selectedColor={selectedColor}
                      onChange={setSelectedColor}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-4 mb-8"
                  >
                    <div ref={photoReelRef}>
                      <PhotoReel photos={capturedPhotos} color={selectedColor} />
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 md:w-5 md:h-5" />
                          Download
                        </>
                      )}
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