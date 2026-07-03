"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  settings?: {
    storeName?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
    socialInstagram?: string;
    socialFacebook?: string;
    socialTiktok?: string;
    socialYoutube?: string;
    footerTagline?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const s = settings || {};

  return (
    <footer className="bg-[#0a0a0c] border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold tracking-tighter mb-3">{s.storeName || "STORM BARZ"}</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {s.footerTagline || "Built for athletes. Tested in the storm."}
            </p>
            <div className="flex gap-4 mt-6">
              {s.socialInstagram && (
                <a href={s.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors text-sm font-bold">
                  IG
                </a>
              )}
              {s.socialFacebook && (
                <a href={s.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors text-sm font-bold">
                  FB
                </a>
              )}
              {s.socialYoutube && (
                <a href={s.socialYoutube} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors text-sm font-bold">
                  YT
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/products" },
                { label: "Parallettes", href: "/products?category=parallettes" },
                { label: "Drops", href: "/drops" },
                { label: "Cart", href: "/cart" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Community", href: "/community" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Contact</h4>
            <ul className="space-y-3">
              {s.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/30 shrink-0" />
                  <a href={`mailto:${s.contactEmail}`} className="text-white/50 hover:text-white text-sm transition-colors">{s.contactEmail}</a>
                </li>
              )}
              {s.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/30 shrink-0" />
                  <a href={`tel:${s.contactPhone}`} className="text-white/50 hover:text-white text-sm transition-colors">{s.contactPhone}</a>
                </li>
              )}
              {s.contactAddress && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="text-white/50 text-sm">{s.contactAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} {s.storeName || "Storm Barz"}. All rights reserved.</p>
          <p className="text-white/20 text-xs">Become the Storm. ⚡</p>
        </div>
      </div>
    </footer>
  );
}
