import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Langues Disponibles - FasoConnect',
  description: 'Découvrez la liste des langues supportées par FasoConnect pour la traduction et la synthèse vocale.',
};

export default function LanguagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
