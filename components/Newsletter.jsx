"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="mt-[7px] px-4 pb-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 px-6 py-12 shadow-lg sm:px-10 lg:py-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-white/10" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white ring-1 ring-white/30">
              <Mail className="h-4 w-4" />
              Newsletter
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Get the latest deals{" "}
              <span className="text-orange-100">straight to your inbox</span>
            </h2>

            <p className="mt-4 max-w-md text-orange-50">
              Be the first to know about new arrivals, seasonal offers and rental
              tips from our team. No spam — just the good stuff.
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="w-full">
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 text-white ring-1 ring-white/30">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <p className="text-sm font-medium">
                    You&apos;re subscribed! Watch your inbox for our next offer.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-white/40 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-white focus:ring-3 focus:ring-white/40"
                  />
                  <button
                    type="submit"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-11 shrink-0 bg-gray-900 px-5 text-white hover:bg-gray-800"
                    )}
                  >
                    Subscribe
                    <Send className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}

              <p className="mt-3 text-xs text-orange-50/80">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
