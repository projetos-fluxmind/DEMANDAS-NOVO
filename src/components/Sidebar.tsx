'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bike,
  Users,
  Gauge,
  Fuel,
  Wrench,
  Bell,
  Wallet,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuSections = [
    {
      title: 'Visão Geral',
      items: [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
      ],
    },
    {
      title: 'Operação',
      items: [
        { href: '/motocicletas', label: 'Motocicletas', icon: Bike },
        { href: '/tecnicos', label: 'Técnicos', icon: Users },
        { href: '/leituras', label: 'Leituras Km', icon: Gauge },
        { href: '/abastecimentos', label: 'Abastecimentos', icon: Fuel },
      ],
    },
    {
      title: 'Manutenção & Controle',
      items: [
        { href: '/manutencoes', label: 'Manutenções', icon: Wrench },
        { href: '/alertas', label: 'Alertas', icon: Bell },
        { href: '/financeiro', label: 'Financeiro', icon: Wallet },
        { href: '/importar', label: 'Importar Dados', icon: FileSpreadsheet },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              FrotaControl
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400 leading-none">Gestão Inteligente</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="py-5 px-3 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-800/80 m-2 rounded-xl bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="text-xs">
            <p className="font-medium text-slate-300">Supabase Online</p>
            <p className="text-[11px] text-slate-400">Banco sincronizado</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
