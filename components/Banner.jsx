"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50">
      {/* Soft decorative glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute -right-20 top-8 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-1 text-sm font-medium text-orange-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Trusted Equipment Rental
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Rent the Right Equipment,{" "}
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
              Build Faster
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-stone-600">
            Excavators, cranes, loaders and more. Choose from our wide range of
            quality machines at affordable daily rates.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/equipment"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/35"
              )}
            >
              Browse Equipment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 px-6 border-orange-300 bg-white/70 text-orange-700 backdrop-blur transition hover:border-orange-400 hover:bg-white"
              )}
            >
              Get Started
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              Verified machines
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-500" />
              Same-day delivery
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rotate-3 rounded-[2rem] bg-gradient-to-br from-orange-400/40 via-orange-300/30 to-amber-200/40"
          />
          <div
            aria-hidden="true"
            className="absolute -inset-1 rotate-1 rounded-[2rem] border border-white/60"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-orange-900/20 ring-1 ring-white/70">
            <Image
              src="/hero.jpg"
              alt="Heavy construction equipment"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-orange-950/25 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
