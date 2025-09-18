
import { useState, useEffect, useRef } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const useAutosaveEffect = (
  saveFunction: () => Promise<any>,
  data: any,
  key: string | null, // User identifier; if null, saving is disabled.
  delay: number = 1000
) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!key) { // If no user is logged in, do nothing.
      setStatus('idle');
      return;
    }

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    setStatus('saving');

    timeoutId.current = setTimeout(async () => {
      try {
        await saveFunction();
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000); 
      } catch (error) {
        console.error("Autosave failed:", error);
        setStatus('error');
      }
    }, delay);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [data, saveFunction, key, delay]);

  return status;
};