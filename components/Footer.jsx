import Link from "next/link";
import { Mail, MapPin, Phone, Wrench } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const columns = [
  {
    title: "Equipment",
    links: [
      { href: "/equipment", label: "All Equipment" },
      { href: "/equipment?category=excavators", label: "Excavators" },
      { href: "/equipment?category=cranes", label: "Cranes" },
      { href: "/equipment?category=loaders", label: "Loaders" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/terms", label: "Rental Terms" },
      { href: "/shipping", label: "Delivery & Pickup" },
      { href: "/help", label: "Help Center" },
    ],
  },
];

const socials = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-white/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-orange-600">
                <Wrench className="h-4 w-4" />
              </span>
              <span className="text-xl font-bold">RentGear</span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-5 text-orange-50">
              Quality excavators, cranes, loaders and more at affordable daily
              rates. Rent the right equipment and build faster with RentGear.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-orange-50">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>24 Industrial Avenue, Springfield</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <a href="tel:+15551234567" className="hover:underline">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a href="mailto:hello@rentgear.com" className="hover:underline">
                  hello@rentgear.com
                </a>
              </li>
            </ul>

            <div className="mt-4 flex items-center gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-orange-600"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                {column.title}
                <span className="mt-1.5 block h-0.5 w-6 rounded bg-white/70" />
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-orange-50 transition-all duration-200 hover:pl-1 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/25 pt-4 text-xs text-orange-100 sm:flex-row">
          <p>© {new Date().getFullYear()} RentGear. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}