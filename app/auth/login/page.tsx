"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth/betterAuthClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await signIn.email({
      email,
      password,
      callbackURL,
      rememberMe,
    });

    if (res.error) {
      setError(res.error.message || "Invalid email or password");
      setIsLoading(false);
    }
    // Redirect happens automatically by BetterAuth if successful
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            disabled={isLoading}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full text-base h-11" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
