'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Motocicleta } from '@/types/models';
import { Bike, Plus, Trash2, Edit3, Search, Sparkles } from 'lucide-react';

export default function MotocicletaList() {
  const [motocicletas, setMotocicletas] = useState<Motocicleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/motocicletas');
        if (!res.ok) throw new Error('Erro ao buscar motocicletas');
        const data = await res.json();
        setMotocicletas(data ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir esta motocicleta?')) return;
    try {
      const res = await fetch('/api/motocicletas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMotocicletas((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert('Erro ao excluir motocicleta.');
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const filteredMotos = motocicletas.filter(
    (m) =>
      m.placa.toLowerCase().includes(search.toLowerCase()) ||
      (m.modelo && m.modelo.toLowerCase().includes(search.toLowerCase())) ||
      (m.marca && m.marca.toLowerCase().includes(search.toLowerCase())) ||
      (m.cidade && m.cidade.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Motocicletas</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {motocicletas.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de placas, modelos, ano e status operacional dos veículos da frota
          </p>
        </div>

        <Link
          href="/motocicletas/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Nova Motocicleta
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por placa, marca, modelo ou cidade..."
          className="w-full text-xs bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading && (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Carregando frota...
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
                  <th className="px-6 py-3.5">Placa</th>
                  <th className="px-6 py-3.5">Marca / Modelo</th>
                  <th className="px-6 py-3.5">Ano / Cor</th>
                  <th className="px-6 py-3.5">Cidade</th>
                  <th className="px-6 py-3.5">Intervalo Óleo</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMotos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Nenhuma motocicleta encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredMotos.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                        {m.placa}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {m.marca || '-'} {m.modelo || ''}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {m.ano || '-'} {m.cor ? `• ${m.cor}` : ''}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{m.cidade || '-'}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono">
                        {m.intervalo_oleo_km || 800} km
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            m.status === 'ativa'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                              : m.status === 'em_manutencao'
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                              : m.status === 'vendida'
                              ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
                              : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
                          }`}
                        >
                          {m.status === 'ativa'
                            ? 'Ativa'
                            : m.status === 'em_manutencao'
                            ? 'Em Manutenção'
                            : m.status === 'vendida'
                            ? 'Vendida'
                            : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir motocicleta"
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
