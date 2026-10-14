import './globals.css';
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'FrotaControl - Gestão Inteligente de Frotas',
  description: 'Sistema administrativo e operacional para gestão de frotas de motocicletas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className="bg-slate-50 min-h-screen flex antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Navbar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
