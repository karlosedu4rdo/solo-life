"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

interface XPGainToastProps {
  amount: number
  onClose: () => void
}

export function XPGainToast({ amount, onClose }: XPGainToastProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300)
    }, 2000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 backdrop-blur-sm transition-all duration-300 ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Zap className="h-4 w-4 text-primary animate-pulse" />
      <span className="font-semibold text-primary">+{amount} XP</span>
    </div>
  )
}
