"use client"

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react"

export function useReveal<T extends HTMLElement>(delay = 0, enabled = true, immediate = false) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(immediate)

  useEffect(() => {
    if (immediate) {
      setShown(true)
      return
    }
    if (!enabled) return
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, immediate])

  return {
    ref,
    shown,
    className: shown ? "garage-enter" : "garage-enter-pending",
    style: { animationDelay: `${delay}ms` } as CSSProperties,
  }
}

export function Reveal({
  delay = 0,
  ready = true,
  immediate = false,
  className = "",
  children,
}: {
  delay?: number
  ready?: boolean
  immediate?: boolean
  className?: string
  children: ReactNode
}) {
  const reveal = useReveal<HTMLDivElement>(delay, ready, immediate)
  return (
    <div ref={reveal.ref} className={`${className} ${reveal.className}`} style={reveal.style}>
      {children}
    </div>
  )
}

export function LifeFill({ value, play }: { value: number; play: boolean }) {
  const life = `${Math.max(0, Math.min(100, value))}%`
  return (
    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
      <div className={play ? "life-fill h-full bg-white" : "h-full w-0 bg-white"} style={{ ["--life" as string]: life }} />
    </div>
  )
}
