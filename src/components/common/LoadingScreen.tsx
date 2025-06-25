import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 0, 0],
        }}
        transition={{
          
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="mb-4"
      >
        
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 rounded-full"
      />

      <p className="mt-4 text-gray-400">Loading Coding Battle...</p>
    </div>
  );
};

export default LoadingScreen;
