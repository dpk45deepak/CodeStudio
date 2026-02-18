"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";
import { signIn } from "@/auth";
import Link from "next/link";

export default function SignUpPage() {
  const handleGoogleSignIn = async () => {
    "use server";
    await signIn("google");
  };

  const handleGithubSignIn = async () => {
    "use server";
    await signIn("github");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-4">Create Account</h1>
          <p className="text-muted-foreground">
            Join DevTgthr SyntaxLab to start coding together
          </p>
        </div>

        <div className="space-y-4">
          <form action={handleGoogleSignIn}>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12"
            >
              <Chrome className="mr-3 h-5 w-5" />
              Continue with Google
            </Button>
          </form>

          <form action={handleGithubSignIn}>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12"
            >
              <Github className="mr-3 h-5 w-5" />
              Continue with GitHub
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
