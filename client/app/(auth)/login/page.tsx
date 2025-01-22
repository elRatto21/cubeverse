"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/useAuth";
import GradientText from "@/components/blocks/TextAnimations/GradientText/GradientText";

export default function LoginPage() {
  const router = useRouter();

  const { login, loading, error } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex pt-[20dvh] justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <GradientText
          colors={["#ea580c", "#fb923c", "#fdba74", "#fb923c", "#ea580c", "#fb923c", "#fdba74", "#fb923c", "#ea580c"]}
          animationSpeed={5}
          showBorder={false}
          className="text-6xl font-superbold text-center text-orange"
        >
          cubeverse
        </GradientText>
        <h2 className="text-center text-3xl font-bold mt-6">Login</h2>
        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-orange-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
