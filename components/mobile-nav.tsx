"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Target, 
  Wallet, 
  Trophy, 
  BarChart3, 
  BookOpen, 
  AlertTriangle, 
  Dumbbell,
  Menu,
  X,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { href: "/", label: "Home", icon: Home, description: "Visão geral" },
  { href: "/habits", label: "Hábitos", icon: Target, description: "Rotinas diárias" },
  { href: "/finance", label: "Finanças", icon: Wallet, description: "Controle financeiro" },
  { href: "/workout", label: "Treino", icon: Dumbbell, description: "Exercícios físicos" },
  { href: "/culture", label: "Cultura", icon: BookOpen, description: "Leitura e aprendizado" },
  { href: "/vices", label: "Vícios", icon: AlertTriangle, description: "Controle de vícios" },
  { href: "/goals", label: "Metas", icon: Trophy, description: "Objetivos pessoais" },
  { href: "/stats", label: "Stats", icon: BarChart3, description: "Estatísticas" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const currentPage = navItems.find(item => item.href === pathname)

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Solo Life</h1>
              {currentPage && (
                <p className="text-xs text-muted-foreground">{currentPage.description}</p>
              )}
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="text-left">Navegação</SheetTitle>
              </SheetHeader>
              
              <div className="px-6 pb-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary-foreground/20" 
                          : "bg-muted group-hover:bg-primary/10"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          isActive ? "text-primary-foreground" : "text-foreground"
                        )}>
                          {item.label}
                        </p>
                        <p className={cn(
                          "text-xs mt-0.5",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 min-w-[60px] flex-1",
                  isActive 
                    ? "text-primary bg-primary/10 scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          {/* More button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 min-w-[60px] flex-1 h-auto",
                  pathname === "/culture" || pathname === "/vices" || pathname === "/goals" || pathname === "/stats"
                    ? "text-primary bg-primary/10 scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-tight text-center">Mais</span>
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </>
  )
}
