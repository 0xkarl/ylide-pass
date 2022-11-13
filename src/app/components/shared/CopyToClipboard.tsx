import React, { FC, ReactNode, useState } from 'react';
import { styled } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy as copyIcon,
  faCheck as copiedIcon,
} from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard as CopyToClipboardComponent } from 'react-copy-to-clipboard';

const CopyToClipboard: FC<{ text: string; children: ReactNode }> = ({
  text,
  children,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboardComponent {...{ text, onCopy }}>
      <Container className={'flex items-center cursor-pointer'}>
        <div>{children}</div>
        <span className='flex items-center'>
          <FontAwesomeIcon width={14} icon={copied ? copiedIcon : copyIcon} />
        </span>
      </Container>
    </CopyToClipboardComponent>
  );
};

export default CopyToClipboard;

const Container = styled('div')({
  span: {
    opacity: '0',
  },

  '&:hover span': {
    opacity: '1',
  },
});
