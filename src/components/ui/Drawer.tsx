import React, { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  const slideDirection = {
    left: {
      enterFrom: '-translate-x-full',
      enterTo: 'translate-x-0',
      leaveFrom: 'translate-x-0',
      leaveTo: '-translate-x-full',
    },
    right: {
      enterFrom: 'translate-x-full',
      enterTo: 'translate-x-0',
      leaveFrom: 'translate-x-0',
      leaveTo: 'translate-x-full',
    },
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

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed inset-y-0 ${positionClasses[position]} flex max-w-full`}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={slideDirection[position].enterFrom}
                enterTo={slideDirection[position].enterTo}
                leave="transform transition ease-in-out duration-300"
                leaveFrom={slideDirection[position].leaveFrom}
                leaveTo={slideDirection[position].leaveTo}
              >
                <Dialog.Panel className={`pointer-events-auto w-screen ${sizeClasses[size]}`}>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {(title || description) && (
                      <div className="px-6 py-6 bg-gray-50 border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            {title && (
                              <Dialog.Title className="text-lg font-semibold text-gray-900">
                                {title}
                              </Dialog.Title>
                            )}
                            {description && (
                              <p className="mt-1 text-sm text-gray-500">
                                {description}
                              </p>
                            )}
                          </div>
                          <div className="ml-3 flex h-7 items-center">
                            <Button variant="ghost" size="sm" onClick={onClose}>
                              <X size={18} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex-1 px-6 py-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};