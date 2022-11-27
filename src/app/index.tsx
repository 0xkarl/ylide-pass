import React from 'react';
import { createRoot } from 'react-dom/client';

import '@styles/css';
import App from '@app/components/global/App';

declare global {
  interface Window {}
}

const container = document.getElementById('root')!;

createRoot(container).render(<App />);
