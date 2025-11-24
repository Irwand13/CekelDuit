import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { getUserProfile } from '../lib/storage';
import { getRandomNgiritMessage } from '../lib/quotes';
import { motion, AnimatePresence } from 'motion/react';

export function NgiritModeAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const profile = getUserProfile();

  useEffect(() => {
    if (profile.ngiritMode) {
      // Show alert randomly
      const shouldShow = Math.random() > 0.7; // 30% chance
      if (shouldShow) {
        setMessage(getRandomNgiritMessage(profile.language));
        setShowAlert(true);
        
        // Auto dismiss after 5 seconds
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-900">
                  {message}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
