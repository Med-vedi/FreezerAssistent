import { useEffect, useState } from 'react';

export const useMediaquery = (query: string) => {
  const [valid, setvalid] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setvalid(e.matches);

    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, [query]);
  
  return valid;
}
