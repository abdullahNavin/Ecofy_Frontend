"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified strength bar logic 0-4
  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.auth.signup({ name, email, password });
      toast.success("Account created successfully! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground">Join the community and start making an impact.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Jane Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

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

          <div className="space-y-2 pt-2">
            <Label htmlFor="password">Password</Label>
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
            
            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="flex gap-1 py-1">
                <div className={`h-1 flex-1 rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-muted'}`} />
                <div className={`h-1 flex-1 rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-muted'}`} />
                <div className={`h-1 flex-1 rounded-full ${strength >= 3 ? 'bg-green-400' : 'bg-muted'}`} />
                <div className={`h-1 flex-1 rounded-full ${strength >= 4 ? 'bg-green-600' : 'bg-muted'}`} />
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full text-base h-11" disabled={isLoading || (password.length > 0 && strength < 2)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
