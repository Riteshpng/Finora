"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Wallet } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  // Determine color based on usage
  const getProgressBarColor = () => {
    if (percentUsed >= 90) return "bg-red-500";
    if (percentUsed >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getTextColor = () => {
    if (percentUsed >= 90) return "text-red-500";
    if (percentUsed >= 75) return "text-yellow-600";
    return "text-muted-foreground";
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-24 h-8 text-sm"
                placeholder="Amount"
                autoFocus
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUpdateBudget}
                disabled={isLoading}
                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-100"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled={isLoading}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget ? (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className={`text-2xl font-bold ${getTextColor()}`}>
                        ${Math.max(0, initialBudget.amount - currentExpenses).toFixed(2)}
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-sm font-medium">${initialBudget.amount.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-2">
              <Progress
                 value={percentUsed}
                 className="h-3 bg-secondary"
                  indicatorClassName={getProgressBarColor()} 
               />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percentUsed.toFixed(1)}% used</span>
                <span>${currentExpenses.toFixed(2)} spent</span>
              </div>
            </div>
          </div>
        ) : (
            <div className="text-center py-6 text-muted-foreground">
                <p>No budget set for this month.</p>
                <Button 
                    variant="link" 
                    onClick={() => setIsEditing(true)}
                    className="mt-2"
                >
                    Set Budget
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}