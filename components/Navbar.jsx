"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient} from "@/lib/auth-client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
];

function UserAvatar({ user, size = "h-9 w-9" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const label = user?.name || user?.email || "User";

  if (user?.image && !imageFailed) {
    return (
      <img
        src={user.image}
        alt={label}
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={`${size} shrink-0 rounded-full border border-orange-200 object-cover`}
      />
    );
  }

  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white`}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setMenuOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const linkClass = (href) =>
    `text-sm font-medium transition-colors hover:text-orange-500 ${
      pathname === href ? "text-orange-500" : "text-stone-600"
    }`;

  const dashboardClass = `text-sm font-medium transition-colors hover:text-orange-500 ${
    pathname.startsWith("/dashboard") ? "text-orange-500" : "text-stone-600"
  }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-200/70 bg-gradient-to-r from-white/90 via-orange-50/80 to-white/90 shadow-sm shadow-orange-900/5 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
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
        <div className="hidden items-center gap-8 md:flex md:ml-12">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href="/dashboard" className={dashboardClass}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex md:ml-auto">
          {isPending ? (
            <span
              aria-hidden="true"
              className="h-9 w-9 animate-pulse rounded-full bg-orange-100"
            />
          ) : user ? (
            <>
              <div className="flex items-center gap-2.5">
                <UserAvatar user={user} />
                <div className="min-w-0 leading-tight">
                  <p className="max-w-[12rem] truncate text-sm font-semibold text-gray-900">
                    {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className="max-w-[12rem] truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/register">Register</Link>
              </Button>
              <Button className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="px-4 pt-4 text-lg font-bold">
              Rent<span className="text-orange-500">Gear</span>
            </SheetTitle>
            <div className="flex flex-col gap-4 px-4 pt-4">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className={linkClass(link.href)}>
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              {user && (
                <SheetClose asChild>
                  <Link href="/dashboard" className={dashboardClass}>
                    Dashboard
                  </Link>
                </SheetClose>
              )}

              {isPending ? null : user ? (
                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name || user.email}
                      </p>
                      {user.name && (
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="bg-orange-500 text-white hover:bg-orange-600" asChild>
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
