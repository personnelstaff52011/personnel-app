'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      const handleLoad = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('PWA ServiceWorker registered successfully:', registration.scope);
          })
          .catch((err) => {
            console.warn('PWA ServiceWorker registration error:', err);
          });
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return null;
}
