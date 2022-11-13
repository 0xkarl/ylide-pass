import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import '@styles/css';
import Loader from '@app/components/shared/PageLoader';

declare global {
  interface Window {}
}

const App = React.lazy(() => import('@app/components/global/App'));

const container = document.getElementById('root')!;

createRoot(container).render(
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>
);
