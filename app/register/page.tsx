import Link from "next/link";
import { AuthLayout } from "@/components/marketing/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="glow-border rounded-[var(--radius-card)] bg-surface p-6 shadow-elevated sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h2>
          <p className="mt-2 text-sm text-muted">
            Start practicing in minutes.{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Already have an account?
            </Link>
          </p>
        </div>
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-center text-sm text-subtle">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Back to home
        </Link>
      </p>
    </AuthLayout>
  );
}
