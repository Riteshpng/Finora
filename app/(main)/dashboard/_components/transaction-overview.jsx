"use client";

import { useState } from "react";

import {

  PieChart,

  Pie,

  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// Premium Finora Color Palette
const COLORS = [
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#EF4444", // Red
];
export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );
  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );
  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  // Calculate expense breakdownfor current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });
  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});
  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card className="border-none drop-shadow-sm bg-card/50 backdrop-blur-sm shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
             <CreditCard className="h-4 w-4 text-muted-foreground" />
             Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[140px] h-8 bg-background/50 border-muted-foreground/20">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                No recent transactions found.
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-full bg-muted border border-border group-hover:scale-105 transition-transform",
                        transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                    )}>
                         {transaction.type === "EXPENSE" ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">
                        {transaction.description || "Untitled Transaction"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "PP")}
                        </p>
                    </div>
                  </div>
                  <div className="text-right font-medium text-sm tabular-nums">
                      {transaction.type === "EXPENSE" ? "-" : "+"}
                      ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="border-none drop-shadow-sm bg-card/50 backdrop-blur-sm shadow-md flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {pieChartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
                 <p className="text-center text-muted-foreground text-sm">
                    No expenses this month yet.
                </p>
            </div>
          ) : (
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Creates the Donut effect
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                     verticalAlign="bottom"
                     height={36}
                     iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
             
              {/* Center Text for Donut Chart */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
                  <div className="text-xl font-bold">
                    ${currentMonthExpenses.reduce((acc, t) => acc + t.amount, 0).toFixed(0)}
                  </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}