import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const OWNER_EMAIL = "princedahiya605@gmail.com";
const OWNER_PASSWORD = "princedahiya@123";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    document.title = "Admin — Northstarr";
    if (session) navigate("/admin", { replace: true });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailNorm = email.trim().toLowerCase();
    if (emailNorm !== OWNER_EMAIL || password !== OWNER_PASSWORD) {
      toast({ title: "Access denied", description: "Invalid admin credentials.", variant: "destructive" });
      return;
    }
    setLoading(true);

    let { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    // Auto-create owner account on first attempt — DB trigger grants admin role and blocks other emails
    if (error && /invalid login credentials/i.test(error.message)) {
      const signup = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (signup.error) {
        setLoading(false);
        return toast({ title: "Sign in failed", description: signup.error.message, variant: "destructive" });
      }
      const retry = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      error = retry.error;
    }

    setLoading(false);
    if (error) return toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    navigate("/admin", { replace: true });
  };

  const sendReset = async () => {
    const target = (email || OWNER_EMAIL).trim();
    if (target.toLowerCase() !== OWNER_EMAIL) {
      return toast({ title: "Access denied", description: "This area is restricted.", variant: "destructive" });
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast({ title: "Could not send reset", description: error.message, variant: "destructive" });
    toast({ title: "Reset email sent", description: `Check ${target} for a password reset link.` });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-xl">Northstarr Admin</span>
      </Link>

      <div className="glow-border rounded-3xl p-8">
        <div className="flex items-center justify-center gap-2 mb-2 text-primary">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs uppercase tracking-widest">Restricted Access</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-center">Admin sign in</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">
          Only the site owner can sign in here.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : "Sign in"}
          </Button>
          <button
            type="button"
            onClick={sendReset}
            disabled={loading}
            className="w-full text-sm text-primary hover:underline text-center"
          >
            Forgot password? Email me a reset link
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
