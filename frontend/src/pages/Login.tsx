import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.1rem)] grid lg:grid-cols-2">
      {/* ── Left Panel ───────────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-foreground text-background p-12 overflow-hidden">
        {/* Geometric decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-background/10" />
          <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full border border-background/10" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full border border-background/10" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-background/10" />
          {/* Large bold number watermark */}
          <span className="absolute -bottom-8 -right-4 text-[220px] font-black text-background/5 leading-none select-none">
            VM
          </span>
        </div>

        {/* Brand */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">
                V
              </span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              VehicleMart
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 bg-background/10 px-3 py-1.5 rounded-full text-xs font-medium text-background/70 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            Nepal's Vehicle Marketplace
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Your next ride
            <br />
            starts here.
          </h1>
          <p className="text-background/60 text-sm leading-relaxed max-w-xs">
            Browse thousands of cars, motorcycles, and scooters listed by
            verified sellers across Nepal.
          </p>

          {/* Stats strip */}
          <div className="flex gap-6 pt-4 border-t border-background/10 mt-6">
            {[
              { value: "500+", label: "Listings" },
              { value: "200+", label: "Sellers" },
              { value: "24/7", label: "Support" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-black">{value}</p>
                <p className="text-xs text-background/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ──────────────────────────────── */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xs">
                V
              </span>
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              VehicleMart
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to manage your listings and more.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium px-3 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-foreground font-semibold hover:text-primary transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
