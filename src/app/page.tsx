import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/handler/sign-in');
}
