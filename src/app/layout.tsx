import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
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
    <html lang="pt-BR" suppressHydrationWarning className={`${dmSans.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
