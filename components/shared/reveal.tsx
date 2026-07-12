"use client"

import { motion, type HTMLMotionProps } from "framer-motion"

import { fadeUp, staggerContainer } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number
}

export function Reveal({ children, className, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={fadeUp}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps extends HTMLMotionProps<"div"> {
  stagger?: number
  delayChildren?: number
}

export function Stagger({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={staggerContainer(stagger, delayChildren)}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} className={cn(className)} {...props}>
      {children}
    </motion.div>
  )
}
