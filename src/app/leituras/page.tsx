'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Gauge, Plus, Trash2, Calendar, Search } from 'lucide-react';

export default function LeiturasPage() {
  const [leituras, setLeituras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchLeituras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leituras_hodometro')
        .select('*')
        .order('data_hora', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setLeituras(data ?? []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeituras();
  }, []);

  const deleteLeitura = async (id: string) => {
    if (!confirm('Confirma exclusão deste registro de hodômetro?')) return;
    try {
      const { error } = await supabase.from('leituras_hodometro').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        fetchLeituras();
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  const filtered = leituras.filter((l) =>
    (l.motocicleta_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leituras de Hodômetro</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {leituras.length} registros
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registro contínuo de quilometragem para cálculo de consumo e trocas de óleo
          </p>
        </div>

        <Link
          href="/leituras/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Nova Leitura
        </Link>
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
            Carregando leituras...
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
                  <th className="px-6 py-3.5">Data / Hora</th>
                  <th className="px-6 py-3.5">Motocicleta ID</th>
                  <th className="px-6 py-3.5">Quilometragem</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      Nenhuma leitura registrada.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-700 font-medium flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(l.data_hora || l.data).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        {l.motocicleta_id}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                        {Number(l.km).toLocaleString('pt-BR')} km
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteLeitura(l.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir leitura"
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
