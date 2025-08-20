import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Command } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const routeTitles: Record<string, string> = {
  '/jobs': 'Jobs',
  '/applications': 'Applications',
  '/candidates': 'Candidates',
  '/interviews': 'Interviews',
  '/offers': 'Offers',
  '/accounts': 'Accounts',
  '/contacts': 'Contacts',
  '/opportunities': 'Opportunities',
  '/activities': 'Activities',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const currentTitle = routeTitles[location.pathname] || 'Dashboard';

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => {
      const path = '/' + array.slice(0, index + 1).join('/');
      return {
        name: routeTitles[path] || segment,
        path,
        current: index === array.length - 1,
      };
    });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.path} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                  <span
                    className={
                      breadcrumb.current
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }
                  >
                    {breadcrumb.name}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search everywhere..."
              className="pl-10 w-64"
            />
          </div>

          {/* Command Palette Hint */}
          <Button variant="outline" size="sm">
            <Command size={16} className="mr-2" />
            <span className="hidden sm:inline">Press</span>
            <kbd className="ml-1 font-mono font-bold">⌘K</kbd>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
        </div>
      </div>
    </header>
  );
};