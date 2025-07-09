import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TransactionForm } from "@/components/TransactionForm";
import { BudgetPlanningCard } from "@/components/BudgetPlanningCard";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target, 
  PlusCircle,
  Wallet,
  PieChart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Loader2
} from "lucide-react";
import financeHero from "@/assets/finance-hero.jpg";

export const FinanceDashboard = () => {
  const { user, signOut } = useAuth();
  const { transactions, categories, loading } = useTransactions();

  // Calculate financial metrics from real data
  const { totalBalance, monthlyIncome, monthlyExpenses, currentSavings } = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate.getMonth() + 1 === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = currentMonthTransactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate total balance (simplified - in real app you'd track this properly)
    const balance = transactions
      .reduce((sum, t) => {
        return t.transaction_type === 'income' 
          ? sum + Number(t.amount)
          : sum - Number(t.amount);
      }, 0);

    return {
      totalBalance: balance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      currentSavings: Math.max(0, balance), // Simplified savings calculation
    };
  }, [transactions]);

  const savingsGoal = 15000;
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl mb-8">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${financeHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-primary-foreground hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <div className="relative h-full flex items-center justify-center text-center">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-2">
                Welcome back, {user?.user_metadata?.full_name || user?.email}!
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Take control of your financial future
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${monthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${monthlyExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              -8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <Target className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentSavings.toLocaleString()}</div>
            <Progress value={savingsProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {savingsProgress.toFixed(1)}% of ${savingsGoal.toLocaleString()} goal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </div>
              <TransactionForm />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.transaction_type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {transaction.transaction_type === 'income' ? (
                        <ArrowUpRight className={`h-4 w-4 text-success`} />
                      ) : (
                        <ArrowDownRight className={`h-4 w-4 text-destructive`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.categories?.name || 'Uncategorized'} • {new Date(transaction.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    transaction.transaction_type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet. Add your first transaction to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Monthly Summary
            </CardTitle>
            <CardDescription>This month's overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-success/20">
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Income</p>
                    <p className="font-bold text-success">${monthlyIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-destructive/20">
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="font-bold text-destructive">${monthlyExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                    <p className="font-bold text-primary">${(monthlyIncome - monthlyExpenses).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Planning */}
      <div className="mb-8">
        <BudgetPlanningCard />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your finances efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="success" className="h-20 flex-col">
                <ArrowUpRight className="h-5 w-5 mb-2" />
                Add Income
              </Button>
              <Button variant="destructive" className="h-20 flex-col">
                <ArrowDownRight className="h-5 w-5 mb-2" />
                Add Expense
              </Button>
              <Button variant="financial" className="h-20 flex-col">
                <PieChart className="h-5 w-5 mb-2" />
                View Reports
              </Button>
              <Button variant="financial" className="h-20 flex-col">
                <Target className="h-5 w-5 mb-2" />
                Manage Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Financial Goals
            </CardTitle>
            <CardDescription>Track your progress towards financial freedom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Emergency Fund</span>
                <Badge variant="secondary">${currentSavings.toLocaleString()}</Badge>
              </div>
              <Progress value={savingsProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {savingsProgress.toFixed(1)}% of ${savingsGoal.toLocaleString()} goal
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="default" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Set New Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};