"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wrench } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href) =>
    `text-sm font-medium transition-colors hover:text-orange-500 ${
      pathname === href ? "text-orange-500" : "text-foreground/70"
    }`;

  const orangeButton = cn(
    buttonVariants(),
    "bg-orange-500 text-white hover:bg-orange-600"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold">
            Rent<span className="text-orange-500">Gear</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:ml-10 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link href="/register" className={buttonVariants({ variant: "ghost" })}>
            Register
          </Link>
          <Link href="/sign-in" className={orangeButton}>
            Sign In
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="outline"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile side menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="px-4 pt-4 text-lg font-bold">
              Rent<span className="text-orange-500">Gear</span>
            </SheetTitle>
            <div className="flex flex-col gap-4 px-4 pt-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register"
                className={buttonVariants({ variant: "outline" })}
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/sign-in"
                className={orangeButton}
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}