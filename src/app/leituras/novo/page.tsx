'use client';

import React from 'react';
import LeituraForm from '@/components/LeituraForm';

export default function NovaLeituraPage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Leitura de Hodômetro</h1>
      <LeituraForm />
    </section>
  );
}
