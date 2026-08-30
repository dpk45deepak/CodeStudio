"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";
import { handleGoogleSignIn, handleGithubSignIn } from "./actions";

export default function SignUpPage() {
  return (
    <div className="relative flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-slate-800/50 rounded-lg bg-slate-900/50 p-10 shadow-lg backdrop-blur-md">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            Create an Account
          </h1>
          <p className="text-xs text-slate-400">
            Sign up to access the full features of CodeStudio.
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

      </div>
    </div>
  );
}
