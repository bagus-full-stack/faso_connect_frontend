import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirmer', 
  cancelText = 'Annuler'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-on-background">{title}</h3>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-on-surface-variant mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 font-medium text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
            {cancelText}
          </button>
          <button onClick={() => { onConfirm(); onCancel(); }} className="px-4 py-2 font-medium bg-error text-white hover:bg-error/90 rounded-full transition-colors shadow-sm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
