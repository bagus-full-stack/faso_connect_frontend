import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-outline/10 border-dashed rounded-3xl bg-surface-variant/10">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-surface-variant text-on-surface/50">
        {icon || <FileText size={32} />}
      </div>
      <h3 className="text-xl font-semibold text-on-background mb-2">{title}</h3>
      <p className="text-on-surface-variant max-w-md">{description}</p>
    </div>
  );
}
