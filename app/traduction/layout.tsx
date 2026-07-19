import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Traduction - FasoConnect',
  description: 'Traduisez des textes entre le français, l\'anglais et les langues locales du Burkina Faso.',
};

export default function TraductionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
