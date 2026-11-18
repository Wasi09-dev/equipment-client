"use client";

import Link from "next/link";
import { ArrowRight, Image, Lock, Mail, User, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RegisterForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: implement register here
    // const formData = new FormData(event.currentTarget);
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
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
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
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100"
                />
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

            <button
              type="submit"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-full bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
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
