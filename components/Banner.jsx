"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
   
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600 ring-1 ring-orange-300">
            Trusted Equipment Rental
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Rent the Right Equipment,{" "}
            <span className="text-orange-500">Build Faster</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Excavators, cranes, loaders and more. Choose from our wide range of
            quality machines at affordable daily rates.
          </p>
<div className="mt-8 flex flex-col gap-4 sm:flex-row">
  <Link
    href="/equipment"
    className={cn(
      buttonVariants({ size: "lg" }),
      "bg-orange-500 text-white hover:bg-orange-600"
    )}
  >
    Browse Equipment
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>

  <Link
    href="/register"
    className={cn(
      buttonVariants({ size: "lg", variant: "outline" }),
      "border-orange-500 text-orange-600 hover:bg-orange-50"
    )}
  >
    Get Started
  </Link>
</div>
        </div>

       
        <div className="relative">
          <div className="absolute -inset-3 rotate-3 rounded-3xl bg-orange-500/30" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/hero.jpg"
              alt="Heavy construction equipment"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}