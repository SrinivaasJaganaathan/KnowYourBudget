import React, { useState, useMemo } from 'react';
import { Calculator, PiggyBank, ShoppingCart, Home, PieChart } from 'lucide-react';

function App() {
  const [weeklyIncome, setWeeklyIncome] = useState<string>('');

  const budgetCalculations = useMemo(() => {
    const income = parseFloat(weeklyIncome) || 0;
    return {
      essentials: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2,
      total: income
    };
  }, [weeklyIncome]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const PieChartComponent = () => {
    const { essentials, wants, savings, total } = budgetCalculations;
    
    if (total === 0) {
      return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 flex items-center justify-center h-64 border border-slate-200">
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Enter income to see chart
          </p>
        </div>
      );
    }

    const essentialsAngle = (essentials / total) * 360;
    const wantsAngle = (wants / total) * 360;
    const savingsAngle = (savings / total) * 360;

    const createPath = (startAngle: number, endAngle: number, radius: number = 80) => {
      const start = (startAngle * Math.PI) / 180;
      const end = (endAngle * Math.PI) / 180;
      
      const x1 = 100 + radius * Math.cos(start);
      const y1 = 100 + radius * Math.sin(start);
      const x2 = 100 + radius * Math.cos(end);
      const y2 = 100 + radius * Math.sin(end);
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
        <div className="flex flex-col items-center space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Budget Breakdown
          </h3>
          
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Essentials - Green */}
              <path
                d={createPath(0, essentialsAngle)}
                fill="#10b981"
                className="transition-all duration-500 ease-in-out hover:opacity-80"
              />
              {/* Wants - Blue */}
              <path
                d={createPath(essentialsAngle, essentialsAngle + wantsAngle)}
                fill="#3b82f6"
                className="transition-all duration-500 ease-in-out hover:opacity-80"
              />
              {/* Savings - Purple */}
              <path
                d={createPath(essentialsAngle + wantsAngle, essentialsAngle + wantsAngle + savingsAngle)}
                fill="#8b5cf6"
                className="transition-all duration-500 ease-in-out hover:opacity-80"
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-sm font-semibold text-slate-700">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-600">Essentials (50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">Wants (30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-slate-600">Savings (20%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 font-inter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl mb-6 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            UK Weekly Budget Allocator
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Smart budgeting made simple. Follow the 50/30/20 rule to manage your weekly finances effectively.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8 transition-all duration-300 hover:shadow-2xl">
          <div className="max-w-md mx-auto">
            <label htmlFor="income" className="block text-lg font-semibold text-slate-700 mb-4 text-center">
              Enter your weekly income (£):
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-xl font-medium">£</span>
              <input
                id="income"
                type="number"
                value={weeklyIncome}
                onChange={(e) => setWeeklyIncome(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-4 text-2xl font-semibold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Budget Cards */}
          <div className="space-y-6">
            {/* Essentials Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Essentials</h3>
                    <p className="text-emerald-100 text-sm">50% of income</p>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold transition-all duration-500">
                {formatCurrency(budgetCalculations.essentials)}
              </p>
              <p className="text-emerald-100 text-sm mt-2">Rent, utilities, groceries, transport</p>
            </div>

            {/* Wants Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Wants</h3>
                    <p className="text-blue-100 text-sm">30% of income</p>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold transition-all duration-500">
                {formatCurrency(budgetCalculations.wants)}
              </p>
              <p className="text-blue-100 text-sm mt-2">Entertainment, dining out, hobbies</p>
            </div>

            {/* Savings Card */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Savings</h3>
                    <p className="text-violet-100 text-sm">20% of income</p>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold transition-all duration-500">
                {formatCurrency(budgetCalculations.savings)}
              </p>
              <p className="text-violet-100 text-sm mt-2">Emergency fund, investments, goals</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex items-center">
            <PieChartComponent />
          </div>
        </div>

        {/* Tips Section */}
        {budgetCalculations.total > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">💡 Budget Tips</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">Track Essentials</h4>
                <p className="text-slate-600 text-sm">Keep essential costs under 50% to maintain financial stability</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">Mindful Spending</h4>
                <p className="text-slate-600 text-sm">Enjoy life within your 30% wants budget to avoid overspending</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <PiggyBank className="w-6 h-6 text-violet-600" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">Save Consistently</h4>
                <p className="text-slate-600 text-sm">Automate your 20% savings to build wealth over time</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
