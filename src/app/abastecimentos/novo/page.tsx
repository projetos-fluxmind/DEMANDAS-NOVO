'use client';

import React from 'react';
import AbastecimentoForm from '@/components/AbastecimentoForm';

export default function NovoAbastecimentoPage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Novo Abastecimento</h1>
      <AbastecimentoForm />
    </section>
  );
}
