'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Bell, Search, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const today = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date());
    setFormattedDate(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search / Context */}
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar moto, placa, técnico..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        {formattedDate && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/70 px-2.5 py-1 rounded-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {formattedDate}
          </span>
        )}
      </div>

      {/* Quick Actions & Notifications */}
      <div className="flex items-center gap-3">
        <Link
          href="/alertas"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Ver alertas"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </Link>

        <div className="h-5 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-2">
          <Link
            href="/motocicletas/novo"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Moto
          </Link>
          <Link
            href="/abastecimentos/novo"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Abastecer
          </Link>
        </div>
      </div>
    </header>
  );
}
