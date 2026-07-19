'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages, Mic, Volume2, History, Globe, Menu, X, User } from 'lucide-react';
import { Logo } from './Logo';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/traduction', label: 'Traduction', icon: Languages },
    { href: '/tts', label: 'Synthèse vocale', icon: Mic },
    { href: '/translate-and-speak', label: 'Traduire et Parler', icon: Volume2 },
    { href: '/languages', label: 'Langues disponibles', icon: Globe },
    { href: '/history', label: 'Historique', icon: History },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-md shadow-md text-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-surface-variant
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-surface-variant">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-white">
            <Logo width={40} height={40} className="w-full h-full" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-primary">FasoConnect</h1>
            <p className="text-xs text-on-surface/70">Langues Burkinabè</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/traduction');
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                    : 'text-on-surface hover:bg-surface-variant'
                  }
                `}
              >
                <link.icon size={20} className={isActive ? 'text-primary' : 'text-on-surface/70'} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-variant">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-on-surface hover:bg-surface-variant transition-colors text-left font-medium">
            <User size={20} className="text-on-surface/70" />
            Profil
          </button>
        </div>
      </aside>
    </>
  );
}
