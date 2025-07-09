import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  color: string;
}

export const BudgetPlanningCard = () => {
  const [open, setOpen] = useState(false);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food & Dining', budgetAmount: 600, spentAmount: 420, color: 'bg-blue-500' },
    { id: '2', name: 'Transportation', budgetAmount: 300, spentAmount: 180, color: 'bg-green-500' },
    { id: '3', name: 'Entertainment', budgetAmount: 200, spentAmount: 195, color: 'bg-purple-500' },
    { id: '4', name: 'Shopping', budgetAmount: 400, spentAmount: 280, color: 'bg-pink-500' },
    { id: '5', name: 'Bills & Utilities', budgetAmount: 500, spentAmount: 340, color: 'bg-orange-500' },
  ]);
  
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const { toast } = useToast();

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const overBudgetCategories = budgets.filter(budget => budget.spentAmount > budget.budgetAmount);

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount) {
      toast({
        title: "Missing Information",
        description: "Please enter both category and amount.",
        variant: "destructive",
      });
      return;
    }

    const budget: BudgetCategory = {
      id: Date.now().toString(),
      name: newBudget.category,
      budgetAmount: parseFloat(newBudget.amount),
      spentAmount: 0,
      color: 'bg-indigo-500'
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', amount: '' });
    setOpen(false);

    toast({
      title: "Budget Created",
      description: `Budget for ${newBudget.category} has been set to $${newBudget.amount}.`,
    });
  };

  const getBudgetStatus = (budget: BudgetCategory) => {
    const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-destructive' };
    if (percentage >= 80) return { status: 'warning', color: 'text-warning' };
    return { status: 'good', color: 'text-success' };
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Budget Planning
            </CardTitle>
            <CardDescription>Track spending against your budget goals</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="financial" size="sm">
                <Settings className="h-4 w-4" />
                Manage Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget Category</DialogTitle>
                <DialogDescription>
                  Set a monthly spending limit for a new category.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category Name</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Groceries, Gas, etc."
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monthly Budget Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} className="flex-1">
                    Add Budget
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Budget Summary */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Total Monthly Budget</span>
            <span className="font-bold">${totalBudget.toLocaleString()}</span>
          </div>
          <Progress value={(totalSpent / totalBudget) * 100} className="mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Spent: ${totalSpent.toLocaleString()}</span>
            <span>Remaining: ${(totalBudget - totalSpent).toLocaleString()}</span>
          </div>
        </div>

        {/* Over Budget Alert */}
        {overBudgetCategories.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Budget Alert</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category is' : 'categories are'} over budget this month.
            </p>
          </div>
        )}

        {/* Budget Categories */}
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spentAmount / budget.budgetAmount) * 100, 100);
            const status = getBudgetStatus(budget);
            
            return (
              <div key={budget.id} className="space-y-3 p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                    <span className="font-medium">{budget.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${status.color}`}>
                      ${budget.spentAmount.toLocaleString()} / ${budget.budgetAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}% used
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className={`h-2 ${
                    percentage >= 100 ? '[&>div]:bg-destructive' : 
                    percentage >= 80 ? '[&>div]:bg-warning' : 
                    '[&>div]:bg-success'
                  }`} 
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  {budget.spentAmount <= budget.budgetAmount ? (
                    <>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        ${(budget.budgetAmount - budget.spentAmount).toFixed(2)} remaining
                      </span>
                      <span>{(100 - percentage).toFixed(0)}% left</span>
                    </>
                  ) : (
                    <>
                      <span className="text-destructive font-medium">
                        ${(budget.spentAmount - budget.budgetAmount).toFixed(2)} over budget
                      </span>
                      <span className="text-destructive">
                        {(percentage - 100).toFixed(0)}% over
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};