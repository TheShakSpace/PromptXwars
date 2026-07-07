/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer select-none pointer-events-auto"
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight * 0.95,
          behavior: "smooth",
        });
      }}
    >
      <span className="font-mono text-[8.5px] text-white/40 tracking-[0.25em] uppercase hover:text-[#4F8CFF] transition-colors">
        Scroll Orbit
      </span>
      <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 relative hover:border-[#4F8CFF] transition-colors group">
        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1.5 h-2 bg-[#4F8CFF] rounded-full"
        />
      </div>
      <ArrowDown className="w-3 h-3 text-white/20 group-hover:text-[#4F8CFF] transition-colors" />
    </motion.div>
  );
}
