import Link from "next/link";
import { Mail, MapPin, Phone, Wrench } from "lucide-react";

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
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="mt-[6px] border-t border-orange-100 bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold">
                Rent<span className="text-orange-500">Gear</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Quality excavators, cranes, loaders and more at affordable daily
              rates. Rent the right equipment and build faster with RentGear.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <span>24 Industrial Avenue, Springfield</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                <a href="tel:+15551234567" className="transition-colors hover:text-orange-500">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                <a href="mailto:hello@rentgear.com" className="transition-colors hover:text-orange-500">
                  hello@rentgear.com
                </a>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 transition-colors hover:text-orange-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-orange-100 pt-8">
          <span className="text-sm font-medium text-gray-700">Follow us</span>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600 ring-1 ring-orange-200 transition-colors hover:bg-orange-500 hover:text-white hover:ring-orange-500"
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-orange-100 pt-6 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} RentGear. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-orange-500">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-orange-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
