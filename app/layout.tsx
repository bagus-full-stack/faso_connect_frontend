import type {Metadata} from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css'; // Global styles
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'FasoConnect - Langues Burkinabè',
  description: 'Application de traduction et de synthèse vocale pour les langues du Burkina Faso.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="flex h-screen overflow-hidden font-sans" suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-surface p-4 md:p-8">
          {children}
        </main>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
