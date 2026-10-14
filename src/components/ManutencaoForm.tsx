'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManutencaoFormSchema, Manutencao } from '@/types/manutencaoForm';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Wrench, ArrowLeft, Save, Droplets } from 'lucide-react';
import Link from 'next/link';

export default function ManutencaoForm({
  initialData,
}: {
  initialData?: Partial<Manutencao>;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Manutencao>({
    resolver: zodResolver(ManutencaoFormSchema) as any,
    defaultValues: {
      moto_id: initialData?.moto_id || '',
      data: initialData?.data || '',
      tipo: initialData?.tipo || 'Preventiva',
      descricao: initialData?.descricao || '',
      km: initialData?.km || 0,
      troca_oleo: initialData?.troca_oleo || false,
    },
  });

  useEffect(() => {
    if (!initialData?.data) {
      setValue('data', new Date().toISOString().split('T')[0]);
    }
  }, [setValue, initialData]);

  const onSubmit = async (data: Manutencao) => {
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('manutencoes')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('manutencoes').insert(data);
        if (error) throw error;
      }
      router.push('/manutencoes');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/manutencoes"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para histórico de manutenções
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {initialData?.id ? 'Editar Manutenção' : 'Registrar Manutenção'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Informe os detalhes do serviço mecânico, peças trocadas e registro de hodômetro.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 space-y-6"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            ID da Motocicleta (UUID) *
          </label>
          <input
            {...register('moto_id')}
            placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
            className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {errors.moto_id && (
            <p className="text-red-500 text-xs mt-1.5">{errors.moto_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Data do Serviço *
            </label>
            <input
              type="date"
              {...register('data')}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.data && (
              <p className="text-red-500 text-xs mt-1.5">{errors.data.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Manutenção
            </label>
            <select
              {...register('tipo')}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="Preventiva">Preventiva</option>
              <option value="Corretiva">Corretiva</option>
              <option value="Preditiva">Preditiva</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Km no Momento *
            </label>
            <input
              type="number"
              {...register('km', { valueAsNumber: true })}
              placeholder="Ex: 15400"
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.km && (
              <p className="text-red-500 text-xs mt-1.5">{errors.km.message}</p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-center gap-3">
          <input
            type="checkbox"
            id="troca_oleo"
            {...register('troca_oleo')}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="troca_oleo" className="text-xs font-medium text-slate-800 flex items-center gap-1.5 cursor-pointer select-none">
            <Droplets className="w-4 h-4 text-blue-600" />
            Troca de óleo do motor realizada nesta manutenção (reinicia o ciclo de alerta)
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Descrição dos Serviços e Peças
          </label>
          <textarea
            {...register('descricao')}
            rows={3}
            placeholder="Ex: Troca de pastilhas de freio dianteiras, regulagem de corrente, filtro de ar..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar Manutenção'}
          </button>
        </div>
      </form>
    </div>
  );
}
