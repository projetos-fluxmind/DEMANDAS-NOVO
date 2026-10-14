'use client';

import React from 'react';
import TecnicoForm from '@/components/TecnicoForm';

export default function NovoTecnicoPage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Novo Técnico</h1>
      <TecnicoForm />
    </section>
  );
}
