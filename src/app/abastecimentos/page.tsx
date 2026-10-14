'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fuel, Plus, Trash2, Calendar, Search } from 'lucide-react';

export default function AbastecimentosPage() {
  const [abastecimentos, setAbastecimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchAbastecimentos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/abastecimentos');
      if (!res.ok) throw new Error('Erro ao buscar abastecimentos');
      const data = await res.json();
      setAbastecimentos(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbastecimentos();
  }, []);

  const deleteAbastecimento = async (id: string) => {
    if (!confirm('Confirma a exclusão deste abastecimento?')) return;
    try {
      const res = await fetch('/api/abastecimentos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAbastecimentos((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert('Erro ao excluir abastecimento');
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const totalLitros = abastecimentos.reduce((acc, a) => acc + Number(a.litros || 0), 0);
  const totalGasto = abastecimentos.reduce(
    (acc, a) => acc + Number(a.total || (a.litros * a.preco_por_litro) || 0),
    0
  );

  const filtered = abastecimentos.filter((a) =>
    (a.motocicleta_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Abastecimentos</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              {abastecimentos.length} registros
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controle de combustível, preço por litro e custo total abastecido na frota
          </p>
        </div>

        <Link
          href="/abastecimentos/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Novo Abastecimento
        </Link>
      </div>

      {/* Mini Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalLitros.toFixed(1)} Litros</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Fuel className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Investimento em Combustível</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="text-sm font-bold">R$</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por ID da motocicleta..."
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
            Carregando abastecimentos...
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
                  <th className="px-6 py-3.5">Motocicleta ID</th>
                  <th className="px-6 py-3.5">Volume (Litros)</th>
                  <th className="px-6 py-3.5">Preço / Litro</th>
                  <th className="px-6 py-3.5">Total Pago</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Nenhum abastecimento registrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-700 font-medium flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {a.data ? new Date(a.data).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                        {a.motocicleta_id}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-800">
                        {Number(a.litros || 0).toFixed(2)} L
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        R$ {Number(a.preco_por_litro || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                        R$ {Number(a.total || (a.litros * a.preco_por_litro) || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteAbastecimento(a.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir abastecimento"
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
