'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MotocicletaSchema, Motocicleta } from '@/types/models';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Bike, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function MotocicletaForm({
  initialData,
}: {
  initialData?: Motocicleta;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Motocicleta>({
    resolver: zodResolver(MotocicletaSchema) as any,
    defaultValues: initialData ?? {
      placa: '',
      marca: '',
      modelo: '',
      cor: '',
      cidade: '',
      status: 'ativa',
      intervalo_oleo_km: 800,
      observacoes: '',
    },
  });

  const onSubmit = async (data: Motocicleta) => {
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('motocicletas')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('motocicletas').insert(data);
        if (error) throw error;
      }
      router.push('/motocicletas');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/motocicletas"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para lista de motocicletas
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {initialData?.id ? 'Editar Motocicleta' : 'Nova Motocicleta'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Preencha os dados do veículo para registro e monitoramento da frota.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Placa do Veículo *
            </label>
            <input
              {...register('placa')}
              placeholder="Ex: ABC1D23"
              className="w-full text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.placa && (
              <p className="text-red-500 text-xs mt-1.5">{errors.placa.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Status Operacional
            </label>
            <select
              {...register('status')}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="ativa">Ativa (Em operação)</option>
              <option value="em_manutencao">Em Manutenção</option>
              <option value="inativa">Inativa (Reserva)</option>
              <option value="vendida">Vendida / Baixada</option>
            </select>
          </div>

          {/* Marca */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Marca
            </label>
            <input
              {...register('marca')}
              placeholder="Ex: Honda, Yamaha..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Modelo
            </label>
            <input
              {...register('modelo')}
              placeholder="Ex: CG 160 Fan, Fazer 250..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Ano */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Ano de Fabricação
            </label>
            <input
              type="number"
              {...register('ano', { valueAsNumber: true })}
              placeholder="Ex: 2023"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Cor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Cor Predominante
            </label>
            <input
              {...register('cor')}
              placeholder="Ex: Vermelha, Preta, Prata..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Cidade / Região */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Cidade / Base de Operação
            </label>
            <input
              {...register('cidade')}
              placeholder="Ex: São Paulo, Campinas..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Intervalo Óleo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Intervalo Troca de Óleo (Km)
            </label>
            <input
              type="number"
              {...register('intervalo_oleo_km', { valueAsNumber: true })}
              placeholder="Padrão: 800 km"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Gera alertas preventivos ao atingir esse limite de rodagem.
            </p>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Observações Adicionais
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            placeholder="Informações sobre seguro, acessórios, rastreador..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Buttons */}
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
            {isSubmitting ? 'Salvando...' : initialData?.id ? 'Atualizar Dados' : 'Cadastrar Motocicleta'}
          </button>
        </div>
      </form>
    </div>
  );
}
