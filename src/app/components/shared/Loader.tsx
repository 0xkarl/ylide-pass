import React, { FC } from 'react';
import { LoaderIcon } from 'react-hot-toast';

const Loader: FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className='mr-1'>{text} ...</span>
      <LoaderIcon />
    </div>
  );
};

export default Loader;
