import { AppBarComponent } from '@/components/AppBarComponent';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBarComponent />
      {children}
    </>
  );
}
