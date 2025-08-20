import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Search, Plus, Navigation, FileText, Users, Building2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob?: () => void;
  onCreateCandidate?: () => void;
  onCreateAccount?: () => void;
  onCreateActivity?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onCreateJob,
  onCreateCandidate,
  onCreateAccount,
  onCreateActivity,
}) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-jobs',
      title: 'Go to Jobs',
      subtitle: 'View all job openings',
      icon: FileText,
      category: 'Navigation',
      action: () => { navigate('/jobs'); onClose(); },
    },
    {
      id: 'nav-candidates',
      title: 'Go to Candidates',
      subtitle: 'View candidate database',
      icon: Users,
      category: 'Navigation',
      action: () => { navigate('/candidates'); onClose(); },
    },
    {
      id: 'nav-applications',
      title: 'Go to Applications',
      subtitle: 'View application pipeline',
      icon: FileText,
      category: 'Navigation',
      action: () => { navigate('/applications'); onClose(); },
    },
    {
      id: 'nav-accounts',
      title: 'Go to Accounts',
      subtitle: 'View customer accounts',
      icon: Building2,
      category: 'Navigation',
      action: () => { navigate('/accounts'); onClose(); },
    },
    {
      id: 'nav-opportunities',
      title: 'Go to Opportunities',
      subtitle: 'View sales opportunities',
      icon: Navigation,
      category: 'Navigation',
      action: () => { navigate('/opportunities'); onClose(); },
    },
    {
      id: 'nav-activities',
      title: 'Go to Activities',
      subtitle: 'View activity timeline',
      icon: Activity,
      category: 'Navigation',
      action: () => { navigate('/activities'); onClose(); },
    },

    // Create actions
    ...(onCreateJob ? [{
      id: 'create-job',
      title: 'Create Job',
      subtitle: 'Add a new job opening',
      icon: Plus,
      category: 'Create',
      action: () => { onCreateJob(); onClose(); },
    }] : []),
    ...(onCreateCandidate ? [{
      id: 'create-candidate',
      title: 'Create Candidate',
      subtitle: 'Add a new candidate',
      icon: Plus,
      category: 'Create',
      action: () => { onCreateCandidate(); onClose(); },
    }] : []),
    ...(onCreateAccount ? [{
      id: 'create-account',
      title: 'Create Account',
      subtitle: 'Add a new account',
      icon: Plus,
      category: 'Create',
      action: () => { onCreateAccount(); onClose(); },
    }] : []),
    ...(onCreateActivity ? [{
      id: 'create-activity',
      title: 'Create Activity',
      subtitle: 'Add a new task or activity',
      icon: Plus,
      category: 'Create',
      action: () => { onCreateActivity(); onClose(); },
    }] : []),
  ], [navigate, onClose, onCreateJob, onCreateCandidate, onCreateAccount, onCreateActivity]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    return commands.filter(command =>
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
      command.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
                    placeholder="Search commands..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>

                {Object.keys(groupedCommands).length > 0 ? (
                  <div className="max-h-96 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
                    {Object.entries(groupedCommands).map(([category, items]) => (
                      <div key={category}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {category}
                        </div>
                        {items.map((command, index) => {
                          const Icon = command.icon;
                          return (
                            <button
                              key={command.id}
                              className={clsx(
                                'flex w-full items-center px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors'
                              )}
                              onClick={command.action}
                            >
                              <Icon className="h-5 w-5 flex-none text-gray-400 mr-3" />
                              <div className="flex-auto text-left">
                                <div className="text-sm font-medium text-gray-900">
                                  {command.title}
                                </div>
                                {command.subtitle && (
                                  <div className="text-xs text-gray-500">
                                    {command.subtitle}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-14 text-center text-sm text-gray-500">
                    No commands found for "{search}"
                  </div>
                )}

                <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
                  <span className="mr-2">Press</span>
                  <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2">
                    ⌘
                  </kbd>
                  <span className="mr-2">+</span>
                  <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2">
                    K
                  </kbd>
                  <span className="mr-4">to toggle</span>
                  <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2">
                    ↩
                  </kbd>
                  <span className="mr-2">to select</span>
                  <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2">
                    esc
                  </kbd>
                  <span>to cancel</span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};