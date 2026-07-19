import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historique - FasoConnect',
  description: 'Retrouvez l\'historique de vos traductions et synthèses vocales récentes.',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
