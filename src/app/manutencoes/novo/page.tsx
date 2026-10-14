'use client';

import React from 'react';
import ManutencaoForm from '@/components/ManutencaoForm';

export default function NovaManutencaoPage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Nova Manutenção</h1>
      <ManutencaoForm />
    </section>
  );
}
