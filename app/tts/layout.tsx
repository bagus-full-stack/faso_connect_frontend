import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Synthèse Vocale (TTS) - FasoConnect',
  description: 'Écoutez des textes en langues locales du Burkina Faso grâce à notre synthèse vocale authentique.',
};

export default function TTSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
