'use client';

import React from 'react';
import AlertaForm from '@/components/AlertaForm';

export default function NovoAlertaPage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Novo Alerta</h1>
      <AlertaForm />
    </section>
  );
}
