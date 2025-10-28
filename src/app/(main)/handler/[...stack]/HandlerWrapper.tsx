'use client';

import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface HandlerWrapperProps {
  children: ReactNode;
}

export function HandlerWrapper({ children }: HandlerWrapperProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflow: 'auto',
      }}
    >
      <Box>
        <IconButton onClick={handleBack} size="small">
          <ArrowBack />
        </IconButton>
      </Box>
      {children}
    </Box>
  );
}
