import { useContext } from 'react';
import { CsrfContext } from '@/contexts/CsrfContext';

/**
 * Hook para acceder al contexto CSRF
 */
export function useCsrf() {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error('useCsrf debe usarse dentro de un CsrfProvider');
  }
  return context;
}