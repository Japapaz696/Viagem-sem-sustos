import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ViagemSemSusto — Seu Guia de Requisitos de Viagem e Visto',
  description:
    'Consulte rapidamente se seu destino exige visto, vacina de febre amarela e validade do passaporte em poucos segundos.',
  keywords: ['visto', 'passaporte', 'viagem internacional', 'vacina febre amarela', 'requisitos de viagem'],
  openGraph: {
    title: 'ViagemSemSusto — Seu Guia de Requisitos de Viagem e Visto',
    description:
      'Consulte rapidamente se seu destino exige visto, vacina de febre amarela e validade do passaporte em poucos segundos.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'ViagemSemSusto',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
