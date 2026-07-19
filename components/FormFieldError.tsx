import { AlertCircle } from 'lucide-react';

interface FormFieldErrorProps {
  error?: string | null;
  className?: string;
}

export function FormFieldError({ error, className = '' }: FormFieldErrorProps) {
  if (!error) return null;

  return (
    <div className={`flex items-center gap-1.5 mt-2 text-sm text-error animate-in fade-in zoom-in-95 ${className}`}>
      <AlertCircle size={16} className="shrink-0" />
      <span className="font-medium">{error}</span>
    </div>
  );
}
