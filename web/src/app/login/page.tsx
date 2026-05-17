import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <AuthForm mode="login" />
    </main>
  );
}
