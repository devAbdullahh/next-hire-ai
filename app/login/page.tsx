import Link from "next/link";
import { AuthLayout } from "@/components/marketing/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="glow-border rounded-[var(--radius-card)] bg-surface p-6 shadow-elevated sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="mt-2 text-sm text-muted">
            Sign in to continue your mock interviews.{" "}
            <Link href="/register" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-center text-sm text-subtle">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Back to home
        </Link>
      </p>
    </AuthLayout>
  );
}
