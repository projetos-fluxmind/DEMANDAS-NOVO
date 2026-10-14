'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tecnico } from '@/types/models';
import { Users, Plus, Trash2, Phone, MapPin, Search } from 'lucide-react';

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchTecnicos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tecnicos');
      if (!res.ok) throw new Error('Erro ao buscar técnicos');
      const data = await res.json();
      setTecnicos(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const deleteTecnico = async (id?: string) => {
    if (!id) return;
    if (!confirm('Confirma a exclusão deste técnico?')) return;
    try {
      const res = await fetch('/api/tecnicos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTecnicos((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert('Erro ao excluir técnico');
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const filtered = tecnicos.filter(
    (t) =>
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      (t.apelido && t.apelido.toLowerCase().includes(search.toLowerCase())) ||
      (t.cidade && t.cidade.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Técnicos & Condutores</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {tecnicos.length} cadastrados
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão dos motoristas, contatos e cidades de operação
          </p>
        </div>

        <Link
          href="/tecnicos/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Novo Técnico
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, apelido ou cidade..."
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
            Carregando técnicos...
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
                  <th className="px-6 py-3.5">Nome Completo</th>
                  <th className="px-6 py-3.5">Apelido</th>
                  <th className="px-6 py-3.5">Telefone</th>
                  <th className="px-6 py-3.5">Cidade</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Nenhum técnico encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 text-sm">
                        {t.nome}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{t.apelido || '-'}</td>
                      <td className="px-6 py-4 text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {t.telefone || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {t.cidade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            t.status === 'ativo'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                              : t.status === 'ferias'
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                              : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
                          }`}
                        >
                          {t.status === 'ativo'
                            ? 'Ativo'
                            : t.status === 'ferias'
                            ? 'Férias'
                            : t.status === 'afastado'
                            ? 'Afastado'
                            : 'Desligado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteTecnico(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir técnico"
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
