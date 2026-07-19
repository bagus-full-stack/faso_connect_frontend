'use client';

import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number; // 0: idle, 1: translating, 2: audio, 3: done
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    { id: 1, label: 'Traduction' },
    { id: 2, label: 'Génération Audio' }
  ];

  if (currentStep === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-8 mt-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                    ${isCompleted ? 'bg-primary text-white shadow-md scale-100' : 
                      isActive ? 'bg-primary/10 text-primary border-2 border-primary scale-110 shadow-sm' : 
                      'bg-surface-variant text-on-surface/40 scale-100'}`}
                >
                  {isCompleted ? <Check size={24} /> : step.id}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider absolute -bottom-6 w-32 text-center transition-colors duration-300 ${isActive || isCompleted ? 'text-primary' : 'text-on-surface/50'}`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`h-1.5 w-16 mx-2 rounded-full transition-all duration-500 relative overflow-hidden bg-surface-variant`} >
                   <div className={`absolute left-0 top-0 bottom-0 bg-primary transition-all duration-500 ${isCompleted ? 'w-full' : isActive ? 'w-1/2 animate-pulse' : 'w-0'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {currentStep < 3 && (
        <div className="text-center mt-12 animate-pulse text-sm font-medium text-primary">
          {currentStep === 1 ? 'Traduction en cours...' : 'Génération de l\'audio...'}
        </div>
      )}
    </div>
  );
}
