import { Link } from '@tanstack/react-router';
import { FileImage, Package, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '首页', href: '/' },
    { id: 'design', label: '设计制作', href: '/design' },
    { id: 'orders', label: '我的订单', href: '/orders' },
    { id: 'profile', label: '用户中心', href: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center">
              <FileImage className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold tracking-tight">PrintAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/design"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-150"
            >
              <Package className="w-4 h-4" />
              开始设计
            </Link>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors duration-150"
            >
              <User className="w-4 h-4 text-foreground" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-4 border-t border-border mt-4">
              <Link
                to="/design"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                <Package className="w-4 h-4" />
                开始设计
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
