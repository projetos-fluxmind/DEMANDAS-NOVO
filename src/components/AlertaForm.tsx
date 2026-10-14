'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertaFormSchema, Alerta } from '@/types/alertaForm';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Bell, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AlertaForm({
  initialData,
}: {
  initialData?: Partial<Alerta>;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Alerta>({
    resolver: zodResolver(AlertaFormSchema) as any,
    defaultValues: {
      moto_id: initialData?.moto_id || null,
      tipo: initialData?.tipo || 'Troca de Óleo',
      mensagem: initialData?.mensagem || '',
      status: initialData?.status || 'pendente',
    },
  });

  const onSubmit = async (data: Alerta) => {
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('alertas')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('alertas').insert(data);
        if (error) throw error;
      }
      router.push('/alertas');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/alertas"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para central de alertas
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {initialData?.id ? 'Editar Alerta' : 'Novo Alerta Manual'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Crie lembretes operacionais ou avisos de conformidade para a equipe de frota.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Alerta *
            </label>
            <select
              {...register('tipo')}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="Troca de Óleo">Troca de Óleo</option>
              <option value="Revisão">Revisão Mecânica</option>
              <option value="Km Limite">Km Limite Atingido</option>
              <option value="Documentação">Documentação / IPVA</option>
              <option value="Outro">Outro Aviso</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-xs mt-1.5">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Status Inicial
            </label>
            <select
              {...register('status')}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="pendente">Pendente (Atenção imediata)</option>
              <option value="resolvido">Resolvido</option>
              <option value="ignorado">Ignorado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            ID da Motocicleta (Opcional)
          </label>
          <input
            {...register('moto_id')}
            placeholder="UUID da moto vinculada (deixe em branco para alerta geral)"
            className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Mensagem do Alerta *
          </label>
          <textarea
            {...register('mensagem')}
            rows={3}
            placeholder="Ex: Moto placa ABC1D23 atingiu o intervalo estipulado de 800km desde a última troca de óleo."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {errors.mensagem && (
            <p className="text-red-500 text-xs mt-1.5">{errors.mensagem.message}</p>
          )}
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
            {isSubmitting ? 'Salvando...' : 'Salvar Alerta'}
          </button>
        </div>
      </form>
    </div>
  );
}
