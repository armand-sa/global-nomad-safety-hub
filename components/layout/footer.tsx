import Link from "next/link";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm font-semibold" aria-label="Footer">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <Link href="/map" className="text-muted-foreground hover:text-primary">
            Safety Map
          </Link>
          <Link href="/alerts" className="text-muted-foreground hover:text-primary">
            Alerts
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-primary">
            Pricing
          </Link>
          <Link href="/blog" className="text-muted-foreground hover:text-primary">
            Blog
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary">
            Contact
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-primary">
            Terms
          </Link>
          <Link href="/cookies" className="text-muted-foreground hover:text-primary">
            Cookies
          </Link>
          <Link href="/disclaimer" className="text-muted-foreground hover:text-primary">
            Disclaimer
          </Link>
          <Link href="/acceptable-use" className="text-muted-foreground hover:text-primary">
            Acceptable Use
          </Link>
          <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
            Forgot Password
          </Link>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Global Digital Nomad Safety Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}