import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-border-secondary bg-bg-secondary py-6 mt-auto hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-text-primary hover:text-accent-primary transition-colors"
          >
            <span className="text-accent-primary">Sam's</span> Walls
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} Sam's Walls. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}