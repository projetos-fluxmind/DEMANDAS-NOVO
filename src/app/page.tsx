'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Bike,
  Users,
  Gauge,
  Fuel,
  Wrench,
  Bell,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    motosTotal: 0,
    motosAtivas: 0,
    motosManutencao: 0,
    tecnicosCount: 0,
    totalCombustivel: 0,
    totalLitros: 0,
    alertasPendentes: 0,
    manutencoesCount: 0,
    leiturasCount: 0,
  });
  const [recentMotos, setRecentMotos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Motocicletas
        const { data: motos } = await supabase.from('motocicletas').select('*');
        const motosList = motos ?? [];
        const ativas = motosList.filter((m) => m.status === 'ativa').length;
        const manutencao = motosList.filter((m) => m.status === 'em_manutencao').length;
        setRecentMotos(motosList.slice(0, 5));

        // Técnicos
        const { count: tecnicos } = await supabase.from('tecnicos').select('*', { count: 'exact', head: true });

        // Abastecimentos
        const { data: abs } = await supabase.from('abastecimentos').select('litros, total, preco_por_litro');
        let totalVal = 0;
        let totalLit = 0;
        if (abs) {
          abs.forEach((a) => {
            totalLit += Number(a.litros || 0);
            totalVal += Number(a.total || (a.litros * a.preco_por_litro) || 0);
          });
        }

        // Alertas
        const { count: alertas } = await supabase
          .from('alertas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pendente');

        // Manutenções
        const { count: mans } = await supabase.from('manutencoes').select('*', { count: 'exact', head: true });

        // Leituras
        const { count: leituras } = await supabase.from('leituras_hodometro').select('*', { count: 'exact', head: true });

        setStats({
          motosTotal: motosList.length,
          motosAtivas: ativas,
          motosManutencao: manutencao,
          tecnicosCount: tecnicos || 0,
          totalCombustivel: totalVal,
          totalLitros: totalLit,
          alertasPendentes: alertas || 0,
          manutencoesCount: mans || 0,
          leiturasCount: leituras || 0,
        });
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: 'Frota Cadastrada',
      value: stats.motosTotal,
      subtitle: `${stats.motosAtivas} ativas em rota`,
      icon: Bike,
      color: 'blue',
      href: '/motocicletas',
    },
    {
      title: 'Técnicos Ativos',
      value: stats.tecnicosCount,
      subtitle: 'Condutores autorizados',
      icon: Users,
      color: 'indigo',
      href: '/tecnicos',
    },
    {
      title: 'Consumo de Combustível',
      value: `R$ ${stats.totalCombustivel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${stats.totalLitros.toFixed(1)}L abastecidos`,
      icon: Fuel,
      color: 'amber',
      href: '/abastecimentos',
    },
    {
      title: 'Alertas Pendentes',
      value: stats.alertasPendentes,
      subtitle: stats.alertasPendentes > 0 ? 'Atenção necessária' : 'Tudo em dia',
      icon: Bell,
      color: stats.alertasPendentes > 0 ? 'rose' : 'emerald',
      href: '/alertas',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-200 mb-4 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Painel Operacional em Tempo Real
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Controle de Frota de Motocicletas
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Acompanhe a quilometragem, histórico de manutenções, controle de combustível e custos operacionais da sua frota em um só lugar.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/motocicletas/novo"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Cadastrar Motocicleta
            </Link>
            <Link
              href="/leituras/novo"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/15 backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              <Gauge className="w-4 h-4" />
              Registrar Hodômetro
            </Link>
            <Link
              href="/abastecimentos/novo"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/15 backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              <Fuel className="w-4 h-4" />
              Novo Abastecimento
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  {card.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    card.color === 'blue'
                      ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                      : card.color === 'indigo'
                      ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                      : card.color === 'amber'
                      ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                      : card.color === 'rose'
                      ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
                      : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 tracking-tight">
                  {loading ? '...' : card.value}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span>{card.subtitle}</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Sections: Recent Fleet & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Motorcycles (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Motocicletas da Frota</h2>
              <p className="text-xs text-slate-500">Últimos veículos cadastrados no sistema</p>
            </div>
            <Link
              href="/motocicletas"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              Ver todas
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Placa</th>
                  <th className="px-4 py-3">Modelo</th>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMotos.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Nenhuma motocicleta cadastrada ainda.{' '}
                      <Link href="/motocicletas/novo" className="text-blue-600 underline">
                        Cadastrar agora
                      </Link>
                    </td>
                  </tr>
                )}
                {recentMotos.map((moto) => (
                  <tr key={moto.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 font-mono">
                      {moto.placa}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {moto.marca ? `${moto.marca} ${moto.modelo || ''}` : moto.modelo || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{moto.cidade || '-'}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          moto.status === 'ativa'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                            : moto.status === 'em_manutencao'
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
                        }`}
                      >
                        {moto.status === 'ativa'
                          ? 'Ativa'
                          : moto.status === 'em_manutencao'
                          ? 'Manutenção'
                          : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/motocicletas/editar/${moto.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Operational Modules (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Ações Rápidas</h3>
            <p className="text-xs text-slate-500 mb-4">Acesso direto às operações rotineiras</p>

            <div className="space-y-2">
              <Link
                href="/manutencoes/novo"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Registrar Manutenção</p>
                    <p className="text-[11px] text-slate-400">Troca de óleo, reparos e peças</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/financeiro"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Painel Financeiro</p>
                    <p className="text-[11px] text-slate-400">Custos, saldo e despesas</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/importar"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Importação em Lote</p>
                    <p className="text-[11px] text-slate-400">Subir planilhas de motos ou condutores</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Alert card */}
          {stats.alertasPendentes > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  {stats.alertasPendentes} alerta(s) necessitando atenção
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Verifique os alertas de troca de óleo ou vencimentos de documentos.
                </p>
                <Link
                  href="/alertas"
                  className="inline-block mt-2 text-xs font-semibold text-amber-900 underline"
                >
                  Abrir central de alertas →
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Frota Regular</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Nenhum alerta crítico pendente de revisão.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
