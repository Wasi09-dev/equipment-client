"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Eye, EyeOff, Image, Lock, Mail, User, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
const RegisterForm = () => {
  const router = useRouter();
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name");
  const image = formData.get("imageUrl");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role") || "customer";

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);
  const { error } = await authClient.signUp.email({
    name,
    email,
    password,
    role,
    image: image || undefined,
  });
  setLoading(false);

  if (error) {
    setError(error.message || "Something went wrong");
    return
  }
toast.add({
  title: "Account created",
  description: "Your account has been created successfully. Please check your email to verify your account.",
  variant: "success",

});
  router.push("/dashboard");
};

  return (
    <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-500/5 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold">
                Rent<span className="text-orange-500">Gear</span>
              </span>
            </Link>

            <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join RentGear and book equipment in minutes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label 
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                I want to join as
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  defaultValue="customer"
                  className="h-11 w-full appearance-none rounded-xl border border-orange-200 bg-white px-4 pr-10 text-sm text-gray-900 outline-none transition focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                >
                  <option value="customer">Customer — rent equipment</option>
                  <option value="owner">Owner — list my equipment</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
              </div>
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Image URL
              </label>
              <div className="relative">
                <Image className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Paste a direct link to your profile photo (optional).
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-orange-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-orange-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-0.5 h-4 w-4 rounded border-orange-300 accent-orange-500"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
{error && (
  <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
    {error}
  </p>
)}
            <button
  type="submit"
  disabled={loading}
  className={cn(
    buttonVariants({ size: "lg" }),
    "h-11 w-full bg-orange-500 text-white hover:bg-orange-600"
  )}
>
  {loading ? "Creating account..." : "Create Account"}
  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
</button>
          </form>

          {/* Toggle */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-orange-500 transition-colors hover:text-orange-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
