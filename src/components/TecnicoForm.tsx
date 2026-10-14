'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TecnicoSchema, Tecnico } from '@/types/models';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function TecnicoForm({
  initialData,
}: {
  initialData?: Tecnico;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Tecnico>({
    resolver: zodResolver(TecnicoSchema) as any,
    defaultValues: initialData ?? {
      nome: '',
      apelido: '',
      telefone: '',
      cidade: '',
      status: 'ativo',
      observacoes: '',
    },
  });

  const onSubmit = async (data: Tecnico) => {
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('tecnicos')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tecnicos').insert(data);
        if (error) throw error;
      }
      router.push('/tecnicos');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/tecnicos"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para lista de técnicos
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {initialData?.id ? 'Editar Técnico' : 'Cadastrar Novo Técnico'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Informe os dados do condutor para atribuição de rotas e vistorias.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Nome Completo *
            </label>
            <input
              {...register('nome')}
              placeholder="Ex: Carlos Alberto da Silva"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.nome && (
              <p className="text-red-500 text-xs mt-1.5">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Apelido / Como é chamado
            </label>
            <input
              {...register('apelido')}
              placeholder="Ex: Carlinhos"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Telefone / WhatsApp
            </label>
            <input
              {...register('telefone')}
              placeholder="(11) 98765-4321"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Cidade / Base
            </label>
            <input
              {...register('cidade')}
              placeholder="Ex: São Paulo"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Status do Colaborador
          </label>
          <select
            {...register('status')}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="ativo">Ativo (Em escala regular)</option>
            <option value="ferias">Férias</option>
            <option value="afastado">Afastado / Licença</option>
            <option value="desligado">Desligado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Observações
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            placeholder="CNH, validade, turno de trabalho..."
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
            {isSubmitting ? 'Salvando...' : initialData?.id ? 'Atualizar Dados' : 'Cadastrar Técnico'}
          </button>
        </div>
      </form>
    </div>
  );
}
