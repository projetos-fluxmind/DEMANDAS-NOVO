'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ImportarPage() {
  const [entidade, setEntidade] = useState('motocicletas');
  const [csvText, setCsvText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!csvText.trim()) {
      alert('Por favor, cole ou digite o conteúdo CSV.');
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('O CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.');
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const rowObj: Record<string, any> = {};
        headers.forEach((header, i) => {
          rowObj[header] = values[i] || null;
        });
        return rowObj;
      });

      let insertedCount = 0;
      if (entidade === 'motocicletas') {
        const payload = rows.map((r) => ({
          placa: r.placa,
          marca: r.marca || null,
          modelo: r.modelo || null,
          ano: r.ano ? parseInt(r.ano, 10) : null,
          cor: r.cor || null,
          cidade: r.cidade || null,
          status: r.status || 'ativa',
          intervalo_oleo_km: r.intervalo_oleo_km ? parseInt(r.intervalo_oleo_km, 10) : 800,
        }));
        const { error } = await supabase.from('motocicletas').insert(payload);
        if (error) throw error;
        insertedCount = payload.length;
      } else if (entidade === 'tecnicos') {
        const payload = rows.map((r) => ({
          nome: r.nome,
          apelido: r.apelido || null,
          telefone: r.telefone || null,
          cidade: r.cidade || null,
          status: r.status || 'ativo',
        }));
        const { error } = await supabase.from('tecnicos').insert(payload);
        if (error) throw error;
        insertedCount = payload.length;
      } else if (entidade === 'leituras') {
        const payload = rows.map((r) => ({
          motocicleta_id: r.motocicleta_id,
          km: parseInt(r.km, 10) || 0,
          data_hora: r.data_hora || new Date().toISOString(),
        }));
        const { error } = await supabase.from('leituras_hodometro').insert(payload);
        if (error) throw error;
        insertedCount = payload.length;
      }

      setStatus({
        type: 'success',
        message: `${insertedCount} registro(s) importado(s) com sucesso na base de dados!`,
      });
      setCsvText('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: `Falha na importação: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const templates: Record<string, string> = {
    motocicletas: 'placa,marca,modelo,ano,cor,cidade,status\nABC1D23,Honda,CG 160 Fan,2023,Vermelha,São Paulo,ativa\nXYZ9E87,Yamaha,Factor 150,2022,Preta,Campinas,ativa',
    tecnicos: 'nome,apelido,telefone,cidade,status\nCarlos Silva,Carlinhos,(11) 98888-7777,São Paulo,ativo\nMarcos Pereira,Marcão,(19) 97777-6666,Campinas,ativo',
    leituras: 'motocicleta_id,km,data_hora\nUUID_DA_MOTO,15420,2026-10-14T10:00:00Z',
  };

  const loadExample = () => {
    setCsvText(templates[entidade] || '');
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Importação em Lote</h1>
        <p className="text-xs text-slate-500 mt-1">
          Importe cadastros de motocicletas, técnicos ou registros de quilometragem via CSV.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Módulo de Destino
          </label>
          <select
            value={entidade}
            onChange={(e) => setEntidade(e.target.value)}
            className="w-full sm:w-72 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="motocicletas">Motocicletas</option>
            <option value="tecnicos">Técnicos / Condutores</option>
            <option value="leituras">Leituras de Km</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Dados em CSV
            </label>
            <button
              type="button"
              onClick={loadExample}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Preencher exemplo
            </button>
          </div>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            placeholder="Cole aqui o texto CSV separado por vírgulas..."
            className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 text-xs ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-800 border border-rose-200/60'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{status.type === 'success' ? 'Sucesso' : 'Erro'}</p>
              <p className="mt-0.5">{status.message}</p>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleImport}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            {loading ? 'Processando importação...' : 'Importar Registros'}
          </button>
        </div>
      </div>
    </section>
  );
}
