"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TextInput } from "@/components/Form";
import { Button, Card } from "@/components/Common";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send a password reset email here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-gray-600 mb-2">
            If an account exists with <strong>{email}</strong>, you will receive password reset instructions.
          </p>
          <p className="text-gray-600 text-sm">
            Check your email and follow the link to reset your password.
          </p>
        </div>

        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to Sign In
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">Enter your email to receive reset instructions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          type="email"
          label="Email Address"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
