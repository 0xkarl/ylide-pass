import { FC, useEffect } from 'react';

const Loader: FC = () => {
  useEffect(() => {
    document.getElementById('boot-loader')!.classList.remove('hidden');
    return () => {
      document.getElementById('boot-loader')!.classList.add('hidden');
    };
  }, []);

  return null;
};

export default Loader;
