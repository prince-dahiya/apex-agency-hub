import { Link } from "react-router-dom";
import { Instagram, Mail, MessageCircle, Sparkles } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/50 mt-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">Apex Digital Solution</span>
        </Link>
        <p className="mt-4 text-muted-foreground max-w-md">
          Grow Online. Look Professional. Convert More. Premium digital services for ambitious brands.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Explore</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
          <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
          <li><Link to="/reviews" className="hover:text-foreground">Reviews</Link></li>
          <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          <li><Link to="/auth" className="hover:text-foreground">Admin</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Connect</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="mailto:princedahiya605@gmail.com" className="hover:text-foreground inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Email</a></li>
          <li><a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
          <li><a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
      <span>© {new Date().getFullYear()} Apex Digital Solution. All rights reserved.</span>
      <Link to="/auth" aria-label="Admin" title="Admin" className="opacity-30 hover:opacity-100 transition-opacity">·</Link>
    </div>
  </footer>
);
