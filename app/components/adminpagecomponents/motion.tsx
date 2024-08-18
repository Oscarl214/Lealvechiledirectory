'use client';
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type MotionProps = {
  children: ReactNode;
};

export const Motion = ({ children }: MotionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5 }}
    >
      {children}
    </motion.div>
  );
};
