"use client"

import { useState, useMemo } from "react"
import { useFinance } from "@/hooks/use-finance"
import { usePlayer } from "@/hooks/use-player"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionCard } from "@/components/transaction-card"
import { TransactionFilters } from "@/components/transaction-filters"
import { FinancialGoalCard } from "@/components/financial-goal-card"
import { FinancialGoalForm } from "@/components/financial-goal-form"
import { PrevisionalBalanceCard } from "@/components/previsional-balance-card"
import { Plus, TrendingUp, TrendingDown, Wallet, Target, AlertCircle } from "lucide-react"
import type { Transaction } from "@/lib/types"

export default function FinancePage() {
  const {
    transactions,
    goals,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    getBalance,
    getMonthlyStats,
    getPrevisionalBalance,
  } = useFinance()
  const { modifyStat } = usePlayer()
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"transactions" | "goals">("transactions")
  const [filters, setFilters] = useState({
    type: "all" as "all" | "income" | "expense",
    category: "all",
    startDate: "",
    endDate: "",
    isFixed: "all" as "all" | "fixed" | "variable",
  })

  const balance = getBalance()
  const currentDate = new Date()
  const monthlyStats = getMonthlyStats(currentDate.getFullYear(), currentDate.getMonth())
  const previsionalBalance = getPrevisionalBalance()

  const fixedIncome = transactions.filter((t) => t.type === "income" && t.isFixed).reduce((acc, t) => acc + t.amount, 0)
  const fixedExpenses = transactions
    .filter((t) => t.type === "expense" && t.isFixed)
    .reduce((acc, t) => acc + t.amount, 0)

  const allCategories = Array.from(new Set(transactions.map((t) => t.category)))

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false
      if (filters.category !== "all" && t.category !== filters.category) return false
      if (filters.isFixed === "fixed" && !t.isFixed) return false
      if (filters.isFixed === "variable" && t.isFixed) return false
      if (filters.startDate && new Date(t.date) < new Date(filters.startDate)) return false
      if (filters.endDate && new Date(t.date) > new Date(filters.endDate)) return false
      return true
    })
  }, [transactions, filters])

  const handleAddTransaction = (transactionData: Parameters<typeof addTransaction>[0]) => {
    addTransaction(transactionData)
    setShowTransactionForm(false)

    if (transactionData.type === "income") {
      modifyStat("wealth", transactionData.amount / 100)
    }
  }

  const handleUpdateTransaction = (transactionData: Parameters<typeof addTransaction>[0]) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData)
      setEditingTransaction(null)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowTransactionForm(false)
  }

  const handleAddGoal = (goalData: Parameters<typeof addGoal>[0]) => {
    addGoal(goalData)
    setShowGoalForm(false)
  }

  const handleAddGoalProgress = (goalId: string, amount: number) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    const newAmount = goal.currentAmount + amount
    const completed = newAmount >= goal.targetAmount

    updateGoal(goalId, {
      currentAmount: Math.min(newAmount, goal.targetAmount),
      completed,
    })

    if (completed) {
      modifyStat("wealth", 10)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-bottom">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Módulo de Finanças</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">O Tesouro</p>
          </div>
        </div>

        <PrevisionalBalanceCard balance={previsionalBalance} fixedIncome={fixedIncome} fixedExpenses={fixedExpenses} />

        <Card className="bg-gradient-to-br from-primary/10 to-card p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Saldo Total</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">R$ {balance.toFixed(2)}</p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                  <span>Receitas (mês)</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-accent">R$ {monthlyStats.income.toFixed(2)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                  <span>Despesas (mês)</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-destructive">
                  R$ {monthlyStats.expenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
            className="flex-1 text-sm sm:text-base"
          >
            Transações
          </Button>
          <Button
            variant={activeTab === "goals" ? "default" : "outline"}
            onClick={() => setActiveTab("goals")}
            className="flex-1 text-sm sm:text-base"
          >
            <Target className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Metas ({goals.length})
          </Button>
        </div>

        {activeTab === "transactions" && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Transações</h2>
              <Button
                onClick={() => {
                  setShowTransactionForm(!showTransactionForm)
                  setEditingTransaction(null)
                }}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </div>

            {showTransactionForm && (
              <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowTransactionForm(false)} />
            )}

            {editingTransaction && (
              <TransactionForm
                initialData={editingTransaction}
                onSubmit={handleUpdateTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            )}

            <TransactionFilters filters={filters} onFilterChange={setFilters} categories={allCategories} />

            {filteredTransactions.length === 0 ? (
              <Card className="flex flex-col items-center justify-center border-dashed py-8 sm:py-12 text-center px-4">
                <AlertCircle className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">
                  {transactions.length === 0 ? "Nenhuma transação registrada" : "Nenhuma transação encontrada"}
                </h3>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground max-w-sm">
                  {transactions.length === 0 ? "Comece adicionando sua primeira transação" : "Tente ajustar os filtros"}
                </p>
                {transactions.length === 0 && (
                  <Button onClick={() => setShowTransactionForm(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Transação
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={deleteTransaction}
                    onEdit={handleEditTransaction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Metas de Economia</h2>
              <Button onClick={() => setShowGoalForm(!showGoalForm)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Meta
              </Button>
            </div>

            {showGoalForm && <FinancialGoalForm onSubmit={handleAddGoal} onCancel={() => setShowGoalForm(false)} />}

            {goals.length === 0 ? (
              <Card className="flex flex-col items-center justify-center border-dashed py-8 sm:py-12 text-center px-4">
                <Target className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">Nenhuma meta criada</h3>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground max-w-sm">
                  Defina suas metas financeiras e acompanhe o progresso
                </p>
                <Button onClick={() => setShowGoalForm(true)} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Meta
                </Button>
              </Card>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {goals.map((goal) => (
                  <FinancialGoalCard
                    key={goal.id}
                    goal={goal}
                    onDelete={deleteGoal}
                    onAddProgress={handleAddGoalProgress}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
