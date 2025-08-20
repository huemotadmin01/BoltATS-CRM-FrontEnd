// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  FileText,
  Building2,
  Contact,
  TrendingUp,
  Activity,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

type Role = 'Admin' | 'Recruiter' | 'Sales';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles?: Role[];
}

const navigation: NavItem[] = [
  // ATS
  { name: 'Jobs',          href: '/jobs',          icon: Briefcase, roles: ['Admin', 'Recruiter'] },
  { name: 'Applications',  href: '/applications',  icon: UserCheck, roles: ['Admin', 'Recruiter'] },
  { name: 'Candidates',    href: '/candidates',    icon: Users,     roles: ['Admin', 'Recruiter'] },
  { name: 'Interviews',    href: '/interviews',    icon: Calendar,  roles: ['Admin', 'Recruiter'] },
  { name: 'Offers',        href: '/offers',        icon: FileText,  roles: ['Admin', 'Recruiter'] },

  // CRM
  { name: 'Accounts',      href: '/accounts',      icon: Building2, roles: ['Admin', 'Sales'] },
  { name: 'Contacts',      href: '/contacts',      icon: Contact,   roles: ['Admin', 'Sales'] },
  { name: 'Opportunities', href: '/opportunities', icon: TrendingUp,roles: ['Admin', 'Sales'] },

  // Common
  { name: 'Activities',    href: '/activities',    icon: Activity },
  { name: 'Reports',       href: '/reports',       icon: BarChart3 },
  { name: 'Settings',      href: '/settings',      icon: Settings,  roles: ['Admin'] },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth() as any;
  const location = useLocation();

  // Fallback to persisted user while AuthContext hydrates
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('ats-crm-user') || 'null'); }
    catch { return null; }
  })();

  const role: Role | undefined = user?.role ?? storedUser?.role;

  // If role is unknown, DO NOT filter — show everything
  const filteredNavigation = navigation.filter((item) =>
    !item.roles || !role || item.roles.includes(role)
  );

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  const displayName: string =
    user?.name || storedUser?.name || user?.email || storedUser?.email || 'User';

  const initials: string = (displayName || 'U')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const prettyRole = role ? role[0].toUpperCase() + role.slice(1).toLowerCase() : '';

  return (
    <div className="flex flex-col h-full bg-gray-900 w-64">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4 py-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ATS</span>
          </div>
          <span className="ml-3 text-white font-semibold text-lg">TalentFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-4 space-y-1">
        {/* ATS */}
        <div className="px-2 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Applicant Tracking
          </h3>
        </div>

        {filteredNavigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(item.href)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {item.name}
            </NavLink>
          );
        })}

        {/* CRM (hide only if we definitively know the role is Recruiter) */}
        {role !== 'Recruiter' && (
          <>
            <div className="px-2 py-2 pt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer Relations
              </h3>
            </div>

            {filteredNavigation.slice(5, 8).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <Icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </NavLink>
              );
            })}
          </>
        )}

        {/* General */}
        <div className="px-2 py-2 pt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            General
          </h3>
        </div>

        {filteredNavigation.slice(8).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(item.href)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="flex-shrink-0 border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{initials || 'U'}</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{displayName}</p>
            {prettyRole && <p className="text-xs text-gray-400">{prettyRole}</p>}
          </div>
          <button
            onClick={logout}
            className="ml-3 text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
