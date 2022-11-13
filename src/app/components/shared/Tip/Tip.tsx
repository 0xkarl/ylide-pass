import React, { FC, ReactNode } from 'react';
import { TooltipProps } from '@mui/material/Tooltip';

import * as S from './Tip.styled';

const Container: FC<{
  icon?: ReactNode;
  title: string;
  description: string[];
  position?: TooltipProps['placement'];
}> = ({ icon, title, description, position = 'bottom' }) => {
  return (
    <S.Tooltip
      title={
        <>
          <S.Content>
            <S.ContentTitle>{title}</S.ContentTitle>
            <S.ContentBody>
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </S.ContentBody>
          </S.Content>
        </>
      }
      placement={position}
      arrow
    >
      <S.Icon>{icon}</S.Icon>
    </S.Tooltip>
  );
};

export default Container;
