"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Target, Wallet, Trophy, BarChart3, BookOpen, AlertTriangle, Dumbbell, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Principais seções (sempre visíveis)
const primaryNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/habits", label: "Hábitos", icon: Target },
  { href: "/finance", label: "Finanças", icon: Wallet },
  { href: "/workout", label: "Treino", icon: Dumbbell },
]

// Seções secundárias (no menu)
const secondaryNavItems = [
  { href: "/culture", label: "Cultura", icon: BookOpen },
  { href: "/vices", label: "Vícios", icon: AlertTriangle },
  { href: "/goals", label: "Metas", icon: Trophy },
  { href: "/stats", label: "Stats", icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-bottom">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-2 py-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 min-w-[70px] flex-1",
                  isActive 
                    ? "text-primary bg-primary/10 scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                <span className="text-[11px] font-medium leading-tight text-center">{item.label}</span>
              </Link>
            )
          })}
          
          {/* Menu button para seções secundárias */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 min-w-[70px] flex-1 h-auto",
                  pathname === "/culture" || pathname === "/vices" || pathname === "/goals" || pathname === "/stats"
                    ? "text-primary bg-primary/10 scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="text-[11px] font-medium leading-tight text-center">Mais</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-center">Navegação</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200",
                        isActive 
                          ? "text-primary bg-primary/10 scale-105" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  )
}
