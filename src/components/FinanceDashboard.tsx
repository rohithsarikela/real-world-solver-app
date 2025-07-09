import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TransactionForm } from "@/components/TransactionForm";
import { BudgetPlanningCard } from "@/components/BudgetPlanningCard";
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
  ArrowDownRight
} from "lucide-react";
import financeHero from "@/assets/finance-hero.jpg";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

export const FinanceDashboard = () => {
  // Mock data - in real app this would come from your backend
  const totalBalance = 12847.32;
  const monthlyIncome = 4500.00;
  const monthlyExpenses = 2847.32;
  const savingsGoal = 15000;
  const currentSavings = 8420.50;

  const recentTransactions: Transaction[] = [
    { id: '1', description: 'Salary Deposit', amount: 4500.00, category: 'Income', date: '2024-01-15', type: 'income' },
    { id: '2', description: 'Grocery Store', amount: -85.42, category: 'Food', date: '2024-01-14', type: 'expense' },
    { id: '3', description: 'Electric Bill', amount: -120.00, category: 'Utilities', date: '2024-01-13', type: 'expense' },
    { id: '4', description: 'Freelance Work', amount: 750.00, category: 'Income', date: '2024-01-12', type: 'income' },
    { id: '5', description: 'Coffee Shop', amount: -4.50, category: 'Food', date: '2024-01-11', type: 'expense' },
  ];

  const budgetCategories: BudgetCategory[] = [
    { name: 'Food & Dining', spent: 420, budget: 600, color: 'bg-blue-500' },
    { name: 'Transportation', spent: 180, budget: 300, color: 'bg-green-500' },
    { name: 'Entertainment', spent: 95, budget: 200, color: 'bg-purple-500' },
    { name: 'Utilities', spent: 340, budget: 400, color: 'bg-orange-500' },
  ];

  const savingsProgress = (currentSavings / savingsGoal) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl mb-8">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${financeHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
          <div className="relative h-full flex items-center justify-center text-center">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-2">
                Personal Finance Tracker
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
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className={`h-4 w-4 text-success`} />
                      ) : (
                        <ArrowDownRight className={`h-4 w-4 text-destructive`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
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