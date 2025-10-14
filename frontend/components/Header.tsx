'use client';

import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onSearchClick: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              CGI Reader
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={onSearchClick}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </button>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Articles
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              À propos
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onSearchClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </button>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Articles
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}