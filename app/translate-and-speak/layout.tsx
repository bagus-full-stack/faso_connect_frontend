import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Traduire et Parler - FasoConnect',
  description: 'Traduisez et écoutez directement le résultat en langues locales du Burkina Faso.',
};

export default function TranslateAndSpeakLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
