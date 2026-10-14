'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Manutencao } from '@/types/manutencaoForm';
import { Wrench, Plus, Trash2, Calendar, CheckCircle2, Search, Droplets } from 'lucide-react';

export default function ManutencoesPage() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchManutencoes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/manutencoes');
      if (!res.ok) throw new Error('Erro ao buscar manutenções');
      const data = await res.json();
      setManutencoes(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManutencoes();
  }, []);

  const deleteManutencao = async (id?: string) => {
    if (!id) return;
    if (!confirm('Confirma a exclusão desta manutenção?')) return;
    try {
      const res = await fetch('/api/manutencoes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setManutencoes((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert('Erro ao excluir manutenção');
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const filtered = manutencoes.filter(
    (m) =>
      (m.moto_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.tipo || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.descricao || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manutenções da Frota</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
              {manutencoes.length} registradas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Histórico completo de revisões preventivas, corretivas e trocas de óleo
          </p>
        </div>

        <Link
          href="/manutencoes/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Nova Manutenção
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por ID da moto, tipo de manutenção ou descrição..."
          className="w-full text-xs bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600">
            Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading && (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Carregando manutenções...
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-xs text-red-600 bg-red-50/50">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Data</th>
                  <th className="px-6 py-3.5">Moto ID</th>
                  <th className="px-6 py-3.5">Tipo</th>
                  <th className="px-6 py-3.5">Km Registrado</th>
                  <th className="px-6 py-3.5">Troca de Óleo</th>
                  <th className="px-6 py-3.5">Descrição</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Nenhuma manutenção registrada.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-700 font-medium flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {m.data ? new Date(m.data).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                        {m.moto_id}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            m.tipo === 'Preventiva'
                              ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                              : m.tipo === 'Corretiva'
                              ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                              : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
                          }`}
                        >
                          {m.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {Number(m.km).toLocaleString('pt-BR')} km
                      </td>
                      <td className="px-6 py-4">
                        {m.troca_oleo ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <Droplets className="w-3.5 h-3.5" />
                            Sim
                          </span>
                        ) : (
                          <span className="text-slate-400">Não</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {m.descricao || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteManutencao(m.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir manutenção"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
