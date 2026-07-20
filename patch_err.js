const fs = require('fs');
let content = fs.readFileSync('hooks/useApiErrorHandler.ts', 'utf8');

const target = `      } else {
        toast.error("Une erreur est survenue, réessayez.", {
          description: apiErr.message
        });
        setApiError(apiErr.message);
      }`;

const replacement = `      } else if (apiErr.statusCode === 429) {
        let retryMsg = "Trop de requêtes, réessayez dans quelques instants.";
        const retryAfter = (apiErr as any).retryAfter;
        if (retryAfter) {
          retryMsg += \` (\${retryAfter}s)\`;
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
      }`;

content = content.replace(target, replacement);
fs.writeFileSync('hooks/useApiErrorHandler.ts', content);
