"use client"

import { useState, useEffect, useCallback } from "react"
import type { Transaction, FinancialGoal, Investment, AnnualProjection } from "@/lib/types"
import { saveTransactions, loadTransactions, saveFinancialGoals, loadFinancialGoals, saveInvestments, loadInvestments } from "@/lib/storage"

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFinanceData = async () => {
      try {
        const savedTransactions = await loadTransactions()
        const savedGoals = await loadFinancialGoals()
        const savedInvestments = await loadInvestments()
        setTransactions(savedTransactions)
        setGoals(savedGoals)
        setInvestments(savedInvestments)
        setError(null)
      } catch (err) {
        console.error("[useFinance] Error loading data:", err)
        setError("Failed to load financial data")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFinanceData()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const saveTransactionsData = async () => {
        try {
          await saveTransactions(transactions)
          setError(null)
        } catch (err) {
          console.error("[useFinance] Error saving transactions:", err)
          setError("Failed to save transactions")
        }
      }
      
      saveTransactionsData()
    }
  }, [transactions, isLoading])

  useEffect(() => {
    if (!isLoading) {
      const saveGoalsData = async () => {
        try {
          await saveFinancialGoals(goals)
          setError(null)
        } catch (err) {
          console.error("[useFinance] Error saving goals:", err)
          setError("Failed to save goals")
        }
      }
      
      saveGoalsData()
    }
  }, [goals, isLoading])

  useEffect(() => {
    if (!isLoading) {
      const saveInvestmentsData = async () => {
        try {
          await saveInvestments(investments)
          setError(null)
        } catch (err) {
          console.error("[useFinance] Error saving investments:", err)
          setError("Failed to save investments")
        }
      }
      
      saveInvestmentsData()
    }
  }, [investments, isLoading])

  const addTransaction = useCallback((transaction: Omit<Transaction, "id" | "createdAt">) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setTransactions((prev) => [newTransaction, ...prev])
      setError(null)
      return newTransaction
    } catch (err) {
      console.error("[useFinance] Error adding transaction:", err)
      setError("Failed to add transaction")
      return null
    }
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    try {
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
      setError(null)
    } catch (err) {
      console.error("[useFinance] Error updating transaction:", err)
      setError("Failed to update transaction")
    }
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    try {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      setError(null)
    } catch (err) {
      console.error("[useFinance] Error deleting transaction:", err)
      setError("Failed to delete transaction")
    }
  }, [])

  const addGoal = useCallback((goal: Omit<FinancialGoal, "id" | "createdAt" | "completed">) => {
    try {
      const newGoal: FinancialGoal = {
        ...goal,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        completed: false,
      }
      setGoals((prev) => [...prev, newGoal])
      setError(null)
      return newGoal
    } catch (err) {
      console.error("[useFinance] Error adding goal:", err)
      setError("Failed to add goal")
      return null
    }
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<FinancialGoal>) => {
    try {
      setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
      setError(null)
    } catch (err) {
      console.error("[useFinance] Error updating goal:", err)
      setError("Failed to update goal")
    }
  }, [])

  const deleteGoal = useCallback((id: string) => {
    try {
      setGoals((prev) => prev.filter((g) => g.id !== id))
      setError(null)
    } catch (err) {
      console.error("[useFinance] Error deleting goal:", err)
      setError("Failed to delete goal")
    }
  }, [])

  const getBalance = useCallback(() => {
    try {
      return transactions.reduce((acc, t) => {
        return t.type === "income" ? acc + t.amount : acc - t.amount
      }, 0)
    } catch (err) {
      console.error("[useFinance] Error calculating balance:", err)
      return 0
    }
  }, [transactions])

  const getMonthlyStats = useCallback(
    (year: number, month: number) => {
      try {
        const monthTransactions = transactions.filter((t) => {
          const date = new Date(t.date)
          return date.getFullYear() === year && date.getMonth() === month
        })

        const income = monthTransactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)

        const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0)

        return { income, expenses, balance: income - expenses }
      } catch (err) {
        console.error("[useFinance] Error calculating monthly stats:", err)
        return { income: 0, expenses: 0, balance: 0 }
      }
    },
    [transactions],
  )

  const getPrevisionalBalance = useCallback(() => {
    try {
      const fixedIncome = transactions
        .filter((t) => t.type === "income" && t.isFixed)
        .reduce((acc, t) => acc + t.amount, 0)

      const fixedExpenses = transactions
        .filter((t) => t.type === "expense" && t.isFixed)
        .reduce((acc, t) => acc + t.amount, 0)

      return fixedIncome - fixedExpenses
    } catch (err) {
      console.error("[useFinance] Error calculating previsional balance:", err)
      return 0
    }
  }, [transactions])

  const getCategoryBreakdown = useCallback(
    (type: "income" | "expense") => {
      try {
        const filtered = transactions.filter((t) => t.type === type)
        const breakdown: Record<string, number> = {}

        filtered.forEach((t) => {
          breakdown[t.category] = (breakdown[t.category] || 0) + t.amount
        })

        return Object.entries(breakdown)
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)
      } catch (err) {
        console.error("[useFinance] Error calculating category breakdown:", err)
        return []
      }
    },
    [transactions],
  )

  // Investment functions
  const addInvestment = useCallback((investment: Omit<Investment, "id" | "createdAt">) => {
    try {
      const newInvestment: Investment = {
        ...investment,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setInvestments((prev) => [...prev, newInvestment])
      setError(null)
      return newInvestment
    } catch (err) {
      console.error("[useFinance] Error adding investment:", err)
      setError("Failed to add investment")
      return null
    }
  }, [])

  const updateInvestment = useCallback((id: string, updates: Partial<Investment>) => {
    try {
      setInvestments((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)))
      setError(null)
    } catch (err) {
      console.error("[useFinance] Error updating investment:", err)
      setError("Failed to update investment")
    }
  }, [])

  const deleteInvestment = useCallback((id: string) => {
    try {
      setInvestments((prev) => prev.filter((inv) => inv.id !== id))
      setError(null)
    } catch (err) {
      console.error("[useFinance] Error deleting investment:", err)
      setError("Failed to delete investment")
    }
  }, [])

  const getTotalInvestmentValue = useCallback(() => {
    try {
      return investments.reduce((acc, inv) => acc + inv.currentValue, 0)
    } catch (err) {
      console.error("[useFinance] Error calculating total investment value:", err)
      return 0
    }
  }, [investments])

  const getTotalInvestmentGain = useCallback(() => {
    try {
      return investments.reduce((acc, inv) => acc + (inv.currentValue - inv.amount), 0)
    } catch (err) {
      console.error("[useFinance] Error calculating total investment gain:", err)
      return 0
    }
  }, [investments])

  // Annual projection function
  const getAnnualProjection = useCallback((year: number = new Date().getFullYear()): AnnualProjection[] => {
    try {
      const fixedIncome = transactions
        .filter((t) => t.type === "income" && t.isFixed)
        .reduce((acc, t) => acc + t.amount, 0)

      const fixedExpenses = transactions
        .filter((t) => t.type === "expense" && t.isFixed)
        .reduce((acc, t) => acc + t.amount, 0)

      const netFlow = fixedIncome - fixedExpenses
      const currentBalance = getBalance()
      
      const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ]

      return months.map((month, index) => {
        const projectedBalance = currentBalance + (netFlow * (index + 1))
        return {
          month,
          projectedBalance,
          fixedIncome,
          fixedExpenses,
          netFlow
        }
      })
    } catch (err) {
      console.error("[useFinance] Error calculating annual projection:", err)
      return []
    }
  }, [transactions, getBalance])

  return {
    transactions,
    goals,
    investments,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    getBalance,
    getMonthlyStats,
    getPrevisionalBalance,
    getCategoryBreakdown,
    getTotalInvestmentValue,
    getTotalInvestmentGain,
    getAnnualProjection,
  }
}
