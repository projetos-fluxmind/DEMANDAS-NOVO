'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, Download, Bike, Users, Fuel, Wrench, Bell, CheckCircle2 } from 'lucide-react';

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMotos: 0,
    motosAtivas: 0,
    totalTecnicos: 0,
    totalAbastecido: 0,
    totalLitros: 0,
    alertasPendentes: 0,
    manutencoesCount: 0,
  });

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const { count: motosTotal } = await supabase.from('motocicletas').select('*', { count: 'exact', head: true });
        const { count: motosAtivas } = await supabase.from('motocicletas').select('*', { count: 'exact', head: true }).eq('status', 'ativa');
        const { count: tecnicosTotal } = await supabase.from('tecnicos').select('*', { count: 'exact', head: true });
        const { count: alertasTotal } = await supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('status', 'pendente');
        const { count: manTotal } = await supabase.from('manutencoes').select('*', { count: 'exact', head: true });

        const { data: abs } = await supabase.from('abastecimentos').select('litros, total, preco_por_litro');
        let totalVal = 0;
        let totalLit = 0;
        if (abs) {
          abs.forEach((a) => {
            totalLit += Number(a.litros || 0);
            totalVal += Number(a.total || (a.litros * a.preco_por_litro) || 0);
          });
        }

        setStats({
          totalMotos: motosTotal || 0,
          motosAtivas: motosAtivas || 0,
          totalTecnicos: tecnicosTotal || 0,
          totalAbastecido: totalVal,
          totalLitros: totalLit,
          alertasPendentes: alertasTotal || 0,
          manutencoesCount: manTotal || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metrica,Valor\n' +
      `Total de Motocicletas,${stats.totalMotos}\n` +
      `Motocicletas Ativas,${stats.motosAtivas}\n` +
      `Total de Tecnicos,${stats.totalTecnicos}\n` +
      `Total Gasto com Combustivel (R$),${stats.totalAbastecido.toFixed(2)}\n` +
      `Litros Abastecidos,${stats.totalLitros.toFixed(2)}\n` +
      `Alertas Pendentes,${stats.alertasPendentes}\n` +
      `Manutencoes Registradas,${stats.manutencoesCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_frota_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Relatórios Gerenciais</h1>
          <p className="text-xs text-slate-500 mt-1">
            Indicadores executivos para tomada de decisão e auditoria de frota
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Exportar Planilha (CSV)
        </button>
      </div>

      {/* Grid of indicators */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Consolidando dados operacionais...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Frota Total</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalMotos}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              ✓ {stats.motosAtivas} ativas em rota ({stats.totalMotos > 0 ? Math.round((stats.motosAtivas / stats.totalMotos) * 100) : 0}% de disponibilidade)
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Condutores</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalTecnicos}</p>
            <p className="text-xs text-slate-500 mt-1">Técnicos habilitados e cadastrados</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Combustível Total</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Fuel className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 font-mono">
              R$ {stats.totalAbastecido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stats.totalLitros.toFixed(1)} Litros abastecidos</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Serviços Mecânicos</span>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.manutencoesCount}</p>
            <p className="text-xs text-slate-500 mt-1">Revisões registradas no histórico</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alertas Pendentes</span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.alertasPendentes}</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Requerem atenção ou agendamento</p>
          </div>
        </div>
      )}
    </section>
  );
}
