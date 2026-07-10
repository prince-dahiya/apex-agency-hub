import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Reset password — Northstarr";
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
    if (password !== confirm) return toast({ title: "Passwords don't match", variant: "destructive" });
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Password updated", description: "You are signed in." });
    navigate("/admin", { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glow-border rounded-3xl p-8">
        <h1 className="font-display font-bold text-2xl text-center">Set a new password</h1>
        {!ready ? (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Open this page from the reset email link. Waiting for recovery session…
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label>New password</Label>
              <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
