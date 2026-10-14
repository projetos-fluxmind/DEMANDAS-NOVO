'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Wallet, Fuel, Wrench, ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from 'lucide-react';

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const [totalAbastecimentos, setTotalAbastecimentos] = useState(0);
  const [totalManutencoes, setTotalManutencoes] = useState(0);
  const [ultimosGastos, setUltimosGastos] = useState<any[]>([]);

  useEffect(() => {
    async function loadFinanceiro() {
      try {
        setLoading(true);

        // Abastecimentos
        const { data: abs } = await supabase.from('abastecimentos').select('*');
        let totalAbs = 0;
        if (abs) {
          totalAbs = abs.reduce((acc, curr) => acc + (curr.total || (curr.litros * curr.preco_por_litro) || 0), 0);
          setTotalAbastecimentos(totalAbs);
        }

        // Manutenções
        const { data: mans } = await supabase.from('manutencoes').select('*');
        let totalMan = 0;
        if (mans) {
          totalMan = mans.length * 180; // Custo médio de revisão/troca
          setTotalManutencoes(totalMan);
        }

        // Combinar últimos gastos
        const gastos = [
          ...(abs || []).map((a) => ({
            id: a.id,
            tipo: 'Abastecimento',
            data: a.data,
            valor: a.total || (a.litros * a.preco_por_litro) || 0,
            descricao: `${a.litros}L a R$ ${Number(a.preco_por_litro || 0).toFixed(2)}/L`,
            icon: Fuel,
          })),
          ...(mans || []).map((m) => ({
            id: m.id,
            tipo: `Manutenção (${m.tipo || 'Geral'})`,
            data: m.data,
            valor: 180,
            descricao: m.descricao || (m.troca_oleo ? 'Troca de óleo' : 'Revisão periódica'),
            icon: Wrench,
          })),
        ];

        gastos.sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime());
        setUltimosGastos(gastos.slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFinanceiro();
  }, []);

  const totalGeral = totalAbastecimentos + totalManutencoes;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Painel Financeiro & Custos</h1>
        <p className="text-xs text-slate-500 mt-1">
          Acompanhamento consolidado de despesas com combustível, manutenções e peças da frota
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Combustível</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              R$ {totalAbastecimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Abastecimentos acumulados</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Fuel className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Oficina & Revisões</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              R$ {totalManutencoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Custos mecânicos estimados</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-slate-50">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custo Operacional Total</p>
            <p className="text-2xl font-bold text-blue-600 mt-1 font-mono">
              R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Soma de combustíveis e oficinas</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent expenses table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Histórico de Lançamentos Recentes</h2>
            <p className="text-xs text-slate-500">Últimos débitos e custos apurados</p>
          </div>
        </div>

        {loading && (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Carregando extrato...
          </div>
        )}

        {!loading && ultimosGastos.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            Nenhum lançamento financeiro registrado.
          </div>
        )}

        {!loading && ultimosGastos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">Data</th>
                  <th className="px-6 py-3.5">Tipo</th>
                  <th className="px-6 py-3.5">Descrição</th>
                  <th className="px-6 py-3.5 text-right">Valor Débito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ultimosGastos.map((g, idx) => {
                  const Icon = g.icon || DollarSign;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-700 font-medium flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {g.data ? new Date(g.data).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                          {g.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{g.descricao}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 text-sm">
                        R$ {Number(g.valor).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
