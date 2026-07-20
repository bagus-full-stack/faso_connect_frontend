import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/types';

export function useApiErrorHandler() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleError = (err: unknown) => {
    if (err instanceof ApiError || (err && typeof err === 'object' && 'statusCode' in err)) {
      const apiErr = err as ApiError;
      
      if (apiErr.statusCode === 400) {
        toast.error("Langue inconnue ou non supportée.", {
          description: apiErr.message || "Veuillez sélectionner une langue valide.",
          action: {
            label: "Voir les langues",
            onClick: () => {
              window.location.href = '/languages';
            }
          }
        });
        setApiError(apiErr.message);
      } else if (apiErr.statusCode === 422) {
        setValidationError(apiErr.message || "Valeur invalide.");
        
        const msg = (apiErr.message || '').toLowerCase();
        const newFieldErrors: Record<string, string> = {};
        
        if (msg.includes('speed') || msg.includes('vitesse')) {
          newFieldErrors['speed'] = "La vitesse doit être comprise entre 0.5x et 2.0x.";
        }
        if (msg.includes('text') || msg.includes('texte')) {
          newFieldErrors['text'] = "Ce champ est requis.";
        }
        if (msg.includes('source')) {
          newFieldErrors['sourceLanguage'] = "La langue source est requise.";
        }
        if (msg.includes('target') || msg.includes('cible')) {
          newFieldErrors['targetLanguage'] = "La langue cible est requise.";
        }
        if (msg.includes('langue') && !msg.includes('source') && !msg.includes('cible')) {
          newFieldErrors['language'] = "La langue est requise.";
        }
        
        if (Object.keys(newFieldErrors).length === 0) {
          newFieldErrors['general'] = apiErr.message;
        }
        
        setFieldErrors(newFieldErrors);
      } else if (apiErr.statusCode === 429) {
        let retryMsg = "Trop de requêtes, réessayez dans quelques instants.";
        const retryAfter = (apiErr as any).retryAfter;
        if (retryAfter) {
          retryMsg += ` (${retryAfter}s)`;
        }
        toast.error("Limite de requêtes atteinte", {
          description: retryMsg
        });
        setApiError(retryMsg);
      } else {
        toast.error("Une erreur est survenue, réessayez.", {
          description: apiErr.message
        });
        setApiError(apiErr.message);
      }
    } else {
      toast.error("Erreur réseau", {
        description: "Veuillez vérifier votre connexion."
      });
      setApiError(err instanceof Error ? err.message : String(err));
    }
  };

  const clearErrors = () => {
    setApiError(null);
    setValidationError(null);
    setFieldErrors({});
  };

  return { 
    apiError, 
    validationError, 
    fieldErrors,
    handleError, 
    clearErrors, 
    setValidationError, 
    setApiError,
    setFieldErrors
  };
}
