import { StackHandler } from '@stackframe/stack';
import { AppBarComponent } from '@/components/AppBarComponent';
import { stackServerApp } from '@/stack/server';

export default function Handler(props: unknown) {
  return (
    <>
      <AppBarComponent />
      <StackHandler fullPage app={stackServerApp} routeProps={props} />
    </>
  );
}
