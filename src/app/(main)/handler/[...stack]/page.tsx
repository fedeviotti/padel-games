import { Box } from '@mui/material';
import { StackHandler } from '@stackframe/stack';
import { stackServerApp } from '@/stack/server';
import { HandlerWrapper } from './HandlerWrapper';

interface HandlerProps {
  params: Promise<{ stack: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Handler(props: HandlerProps) {
  const resolvedProps = {
    params: await props.params,
    searchParams: await props.searchParams,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto' }}>
      <HandlerWrapper>
        <StackHandler fullPage app={stackServerApp} routeProps={resolvedProps} />
      </HandlerWrapper>
    </Box>
  );
}
