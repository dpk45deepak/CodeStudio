import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";
import { signIn } from "@/auth";

async function handleGoogleSignIn(){
"use server"
await signIn("google")
}

async function handleGithubSignIn(){
"use server"
await signIn("github")
}

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-semibold text-center bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Choose your preferred sign-in method
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <form action={handleGoogleSignIn}>
          <Button type="submit" variant={"outline"} className="w-full bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
            <Chrome className="mr-2 h-4 w-4" />
            <span>Sign in with google</span>
          </Button>
        </form>
        <form action={handleGithubSignIn}>
          <Button type="submit" variant={"outline"} className="w-full bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
            <Github className="mr-2 h-4 w-4" />
            <span>Sign in with github</span>
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-center text-gray-500 w-full">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-blue-400">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-blue-400">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInFormClient;
