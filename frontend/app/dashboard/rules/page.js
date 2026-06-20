"use client";

import { useState } from "react";
import { Wand2, Plus, Trash2, ArrowRight } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState([
    { id: 1, keyword: "STARBUCKS", category: "Food & Dining", active: true },
    { id: 2, keyword: "UBER", category: "Transportation", active: true },
    { id: 3, keyword: "NETFLIX", category: "Entertainment", active: true },
    { id: 4, keyword: "AWS", category: "Software Subscriptions", active: true },
  ]);
  
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("Food & Dining");
  
  const categories = ["Food & Dining", "Transportation", "Entertainment", "Software Subscriptions", "Utilities", "Office Supplies", "Travel"];

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newKeyword) return;
    
    setRules([{
      id: Date.now(),
      keyword: newKeyword.toUpperCase(),
      category: newCategory,
      active: true
    }, ...rules]);
    
    setNewKeyword("");
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wand2 className="text-blue-600" size={24} /> Auto-Categorization Rules
        </h1>
        <p className="text-sm text-slate-500 mt-1">Define keywords to automatically categorize transactions during PDF extraction.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Rule Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus size={18} /> Create New Rule
            </h2>
            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">If description contains:</label>
                <input 
                  type="text" 
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="e.g. ZOMATO"
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Then categorize as:</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button 
                type="submit"
                disabled={!newKeyword}
                className="w-full mt-2 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                Add Rule
              </button>
            </form>
          </div>
        </div>

        {/* Rules List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Active Rules ({rules.length})</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {rules.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No rules created yet.</div>
              ) : (
                rules.map((rule) => (
                  <div key={rule.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono text-sm font-bold text-slate-700">
                        {rule.keyword}
                      </div>
                      <ArrowRight size={16} className="text-slate-400" />
                      <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                        {rule.category}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Rule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
