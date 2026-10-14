'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alerta } from '@/types/alertaForm';
import { Bell, Plus, CheckCircle2, Trash2, AlertTriangle, Search, Check } from 'lucide-react';

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('todos');

  const fetchAlertas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alertas');
      if (!res.ok) throw new Error('Erro ao buscar alertas');
      const data = await res.json();
      setAlertas(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const updateStatus = async (id?: string, status?: string) => {
    if (!id || !status) return;
    try {
      const res = await fetch('/api/alertas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setAlertas((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: status as any } : a))
        );
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const deleteAlerta = async (id?: string) => {
    if (!id) return;
    if (!confirm('Confirma a exclusão deste alerta?')) return;
    try {
      const res = await fetch('/api/alertas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAlertas((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert('Erro ao excluir alerta');
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const filtered = alertas.filter((a) => {
    if (filterStatus === 'pendentes') return a.status === 'pendente';
    if (filterStatus === 'resolvidos') return a.status === 'resolvido';
    return true;
  });

  const pendentesCount = alertas.filter((a) => a.status === 'pendente').length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Central de Alertas</h1>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                pendentesCount > 0
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              }`}
            >
              {pendentesCount} pendente(s)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Notificações operacionais sobre troca de óleo, vencimentos e revisões da frota
          </p>
        </div>

        <Link
          href="/alertas/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Novo Alerta Manual
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setFilterStatus('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterStatus === 'todos'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Todos ({alertas.length})
        </button>
        <button
          onClick={() => setFilterStatus('pendentes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterStatus === 'pendentes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pendentes ({pendentesCount})
        </button>
        <button
          onClick={() => setFilterStatus('resolvidos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterStatus === 'resolvidos'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resolvidos ({alertas.length - pendentesCount})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading && (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Carregando notificações...
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
                  <th className="px-6 py-3.5">Categoria</th>
                  <th className="px-6 py-3.5">Moto ID</th>
                  <th className="px-6 py-3.5">Mensagem do Alerta</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Nenhum alerta nesta categoria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {a.tipo}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                        {a.moto_id || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-700 max-w-md">
                        {a.mensagem}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            a.status === 'pendente'
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                              : a.status === 'resolvido'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                              : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
                          }`}
                        >
                          {a.status === 'pendente'
                            ? 'Pendente'
                            : a.status === 'resolvido'
                            ? 'Resolvido'
                            : 'Ignorado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {a.status === 'pendente' && (
                          <button
                            onClick={() => updateStatus(a.id, 'resolvido')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Resolver
                          </button>
                        )}
                        <button
                          onClick={() => deleteAlerta(a.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir alerta"
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
