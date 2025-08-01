import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '@/data/portfolio';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { KEYS, trapFocus } from '@/utils/keyboard';

const NavigationHeader: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Get current active section from URL path
  const currentPath = location.pathname === '/' ? '/about' : location.pathname;
  const activeSection = currentPath.replace('/', '') || 'about';

  const navigationItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Handle keyboard events for mobile menu
  const handleMobileMenuKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!isMenuOpen || !mobileMenuRef.current) return;

      switch (event.key) {
        case KEYS.ESCAPE: {
          event.preventDefault();
          closeMenu();
          // Return focus to menu button
          const menuButton = document.querySelector('[aria-label*="menu"]') as HTMLElement;
          menuButton?.focus();
          break;
        }
        case KEYS.TAB:
          trapFocus(mobileMenuRef.current, event as unknown as KeyboardEvent);
          break;
      }
    },
    [isMenuOpen]
  );

  // Close menu on escape key from anywhere
  React.useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      // Focus the mobile menu when it opens
      setTimeout(() => {
        const firstFocusable = mobileMenuRef.current?.querySelector('a, button') as HTMLElement;
        firstFocusable?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/about" onClick={closeMenu}>
            <h1 className="text-xl font-bold text-slate-100 hover:text-teal-300 transition-colors">
              {portfolioData.personal.name}
            </h1>
          </Link>

          <button
            onClick={toggleMenu}
            className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={
              isMenuOpen ? t('common.closeMenu', 'Close menu') : t('common.openMenu', 'Open menu')
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="true"
          >
            {isMenuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />

            {/* Menu Content */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 z-50 p-6 pt-24"
              onKeyDown={handleMobileMenuKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-navigation-title"
              id="mobile-navigation"
            >
              <div className="space-y-8">
                {/* Hidden title for screen readers */}
                <h2 id="mobile-navigation-title" className="sr-only">
                  {t('nav.mobileMenuTitle', 'Mobile Navigation Menu')}
                </h2>

                <nav className="space-y-6" role="navigation" aria-label="Mobile navigation">
                  {navigationItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    const routePath = item.id === 'about' ? '/' : `/${item.id}`;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={routePath}
                          onClick={closeMenu}
                          aria-current={isActive ? 'page' : undefined}
                          className={`block py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                            isActive
                              ? 'bg-teal-600/20 text-teal-300 border-l-4 border-teal-300'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="text-lg font-medium tracking-wide uppercase">
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Language Switcher */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <LanguageSwitcher variant="mobile" />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationHeader;
