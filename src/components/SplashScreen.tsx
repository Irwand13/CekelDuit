import { motion } from 'motion/react';
import { Wallet, Sparkles } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-400 to-yellow-300 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6"
        >
          <Wallet className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white mb-2"
        >
          CekelDuit
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-white/90"
        >
          <Sparkles className="w-4 h-4" />
          <p>Cekel Duitmu, Wujudkan Impianmu!</p>
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
