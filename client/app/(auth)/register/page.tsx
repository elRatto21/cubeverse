"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/useAuth";
import GradientText from "@/components/blocks/TextAnimations/GradientText/GradientText";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const { loading, error } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, password });
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const register = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  };

  return (
    <div className="min-h-screen flex pt-[15dvh] justify-center select-none">
      <div className="max-w-md w-full space-y-8 p-8">
        <GradientText
          colors={[
            "#a855f7",
            "#9333ea",
            "#7e22ce",
            "#a855f7",
            "#9333ea",
            "#7e22ce",
            "#a855f7",
            "#9333ea",
            "#7e22ce",
          ]}
          animationSpeed={5}
          showBorder={false}
          className="text-6xl font-superbold text-center text-orange"
        >
          cubeverse
        </GradientText>
        <h2 className="text-center text-3xl font-bold pt-3">Register</h2>
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
          {error && <div className="text-primary text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="flex flex-col justify-center pt-6 gap-5">
          <div className="flex justify-between items-center">
            <Separator className="w-[40%] ml-3" />
            <span className="">or</span>
            <Separator className="w-[40%] mr-3" />
          </div>
          <div className="flex justify-center">
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 hover:scale-110 ease-in-out transform transition duration-150"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
