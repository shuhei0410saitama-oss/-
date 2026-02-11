import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/topics", label: "論点学習" },
  { to: "/exam-guide", label: "受験ガイド" },
  { to: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="font-serif text-lg text-text-primary tracking-wide hover:text-accent transition-colors duration-200"
            >
              FAR Study Lab
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-dark-border text-center">
          <p className="text-sm text-text-muted">
            &copy; 2026 FAR Study Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
