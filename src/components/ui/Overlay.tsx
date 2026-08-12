import { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Close } from './Icons';

function useLockedBody(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, onClose]);
}

export function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      aria-hidden
      className="fixed inset-0 z-40 animate-fade-in bg-ink/25 backdrop-blur-[2px]"
    />
  );
}

/** Right-hand detail panel used for opportunities and AI workers. */
export function SidePanel({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useLockedBody(open, onClose);
  if (!open) return null;

  return (
    <>
      <Backdrop onClose={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-dvh w-full flex-col bg-surface shadow-panel',
          'animate-panel-in sm:w-[min(560px,92vw)]',
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="display-3 text-ink text-balance">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="-mt-1 -mr-1 shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <Close className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>

        {footer && (
          <footer className="border-t border-line bg-canvas/60 px-6 py-4 sm:px-8">
            {footer}
          </footer>
        )}
      </aside>
    </>
  );
}

/** Centred modal used for the Smooth Operator handoff. */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  wide?: boolean;
}) {
  useLockedBody(open, onClose);
  if (!open) return null;

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className={cn(
            'relative w-full animate-scale-in rounded-2xl border border-line bg-surface shadow-lift',
            wide ? 'max-w-3xl' : 'max-w-xl',
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <Close className="size-5" />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
