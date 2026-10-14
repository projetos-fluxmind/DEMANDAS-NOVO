'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeituraFormSchema } from '@/types/leiturasForm';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Gauge, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function LeituraForm({
  initialData,
}: {
  initialData?: {
    motocicleta_id: string;
    data: string;
    km: number;
    observacoes?: string;
  };
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LeituraFormSchema) as any,
    defaultValues: initialData ?? {
      motocicleta_id: '',
      data: '',
      km: 0,
      observacoes: '',
    },
  });

  React.useEffect(() => {
    if (!initialData?.data) {
      setValue('data', new Date().toISOString().split('T')[0]);
    }
  }, [setValue, initialData]);

  const onSubmit = async (data: any) => {
    try {
      if (initialData?.motocicleta_id) {
        const { error } = await supabase
          .from('leituras_hodometro')
          .update(data)
          .eq('id', (initialData as any).id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('leituras_hodometro').insert(data);
        if (error) throw error;
      }
      router.push('/leituras');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/leituras"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para lista de leituras
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {initialData?.motocicleta_id ? 'Editar Leitura' : 'Registrar Leitura de Hodômetro'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Informe a quilometragem atual do veículo para controle de rotas e preventiva.
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
            {...register('motocicleta_id')}
            placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
            className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {errors.motocicleta_id && (
            <p className="text-red-500 text-xs mt-1.5">{errors.motocicleta_id.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Data da Leitura *
            </label>
            <input
              type="date"
              {...register('data')}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.data && (
              <p className="text-red-500 text-xs mt-1.5">{errors.data.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Quilometragem (Km) *
            </label>
            <input
              type="number"
              {...register('km', { valueAsNumber: true })}
              placeholder="Ex: 14500"
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.km && (
              <p className="text-red-500 text-xs mt-1.5">{errors.km.message as string}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Observações
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            placeholder="Observações do técnico, estado do pneu, etc..."
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
            {isSubmitting ? 'Salvando...' : 'Salvar Leitura'}
          </button>
        </div>
      </form>
    </div>
  );
}
