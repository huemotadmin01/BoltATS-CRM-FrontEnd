import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KEYBOARD_SHORTCUTS } from '../config';

interface UseKeyboardProps {
  onNew?: () => void;
  onSearch?: () => void;
  onCommandPalette?: () => void;
}

export const useKeyboard = ({ onNew, onSearch, onCommandPalette }: UseKeyboardProps = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { ctrlKey, metaKey, code } = event;
      const isModifierPressed = ctrlKey || metaKey;

      switch (code) {
        case KEYBOARD_SHORTCUTS.NEW:
          if (!isModifierPressed) {
            event.preventDefault();
            onNew?.();
          }
          break;

        case KEYBOARD_SHORTCUTS.SEARCH:
          if (!isModifierPressed) {
            event.preventDefault();
            onSearch?.();
          }
          break;

        case KEYBOARD_SHORTCUTS.COMMAND_PALETTE:
          if (isModifierPressed) {
            event.preventDefault();
            onCommandPalette?.();
          }
          break;

        case KEYBOARD_SHORTCUTS.GOTO_JOBS:
          if (event.shiftKey && event.code === 'KeyG') {
            // G + J for Jobs
            if (code === KEYBOARD_SHORTCUTS.GOTO_JOBS) {
              event.preventDefault();
              navigate('/jobs');
            }
          }
          break;

        case KEYBOARD_SHORTCUTS.GOTO_CANDIDATES:
          if (event.shiftKey && event.code === 'KeyG') {
            // G + C for Candidates
            if (code === KEYBOARD_SHORTCUTS.GOTO_CANDIDATES) {
              event.preventDefault();
              navigate('/candidates');
            }
          }
          break;

        case KEYBOARD_SHORTCUTS.GOTO_ACCOUNTS:
          if (event.shiftKey && event.code === 'KeyG') {
            // G + A for Accounts
            if (code === KEYBOARD_SHORTCUTS.GOTO_ACCOUNTS) {
              event.preventDefault();
              navigate('/accounts');
            }
          }
          break;

        case KEYBOARD_SHORTCUTS.GOTO_OPPORTUNITIES:
          if (event.shiftKey && event.code === 'KeyG') {
            // G + O for Opportunities
            if (code === KEYBOARD_SHORTCUTS.GOTO_OPPORTUNITIES) {
              event.preventDefault();
              navigate('/opportunities');
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onNew, onSearch, onCommandPalette]);
};