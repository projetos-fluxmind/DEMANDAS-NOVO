'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AbastecimentoFormSchema } from '@/types/abastecimentoForm';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Fuel, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AbastecimentoForm({
  initialData,
}: {
  initialData?: {
    motocicleta_id: string;
    data: string;
    litros: number;
    preco_por_litro: number;
    observacoes?: string;
  };
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AbastecimentoFormSchema) as any,
    defaultValues: initialData ?? {
      motocicleta_id: '',
      data: '',
      litros: 0,
      preco_por_litro: 0,
      observacoes: '',
    },
  });

  const litros = watch('litros');
  const preco = watch('preco_por_litro');
  const totalCalculado = (Number(litros) || 0) * (Number(preco) || 0);

  React.useEffect(() => {
    if (!initialData?.data) {
      setValue('data', new Date().toISOString().split('T')[0]);
    }
  }, [setValue, initialData]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        total: totalCalculado,
      };
      if (initialData?.motocicleta_id) {
        const { error } = await supabase
          .from('abastecimentos')
          .update(payload)
          .eq('id', (initialData as any).id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('abastecimentos').insert(payload);
        if (error) throw error;
      }
      router.push('/abastecimentos');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/abastecimentos"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para lista de abastecimentos
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {initialData?.motocicleta_id ? 'Editar Abastecimento' : 'Novo Abastecimento'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Registre o abastecimento de combustível com cálculo automático do valor total.
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Data *
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
              Litros *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('litros', { valueAsNumber: true })}
              placeholder="Ex: 12.50"
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.litros && (
              <p className="text-red-500 text-xs mt-1.5">{errors.litros.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Preço / Litro (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('preco_por_litro', { valueAsNumber: true })}
              placeholder="Ex: 5.89"
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.preco_por_litro && (
              <p className="text-red-500 text-xs mt-1.5">{errors.preco_por_litro.message as string}</p>
            )}
          </div>
        </div>

        {/* Live calculated total banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Calculado:
          </span>
          <span className="text-lg font-bold font-mono text-slate-900">
            R$ {totalCalculado.toFixed(2)}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Observações / Posto
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            placeholder="Nome do posto, nota fiscal, tipo de combustível..."
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
            {isSubmitting ? 'Salvando...' : 'Salvar Abastecimento'}
          </button>
        </div>
      </form>
    </div>
  );
}
