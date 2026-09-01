import { useCallback, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Close } from './Icons';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared dialog behaviour: lock the page behind it, keep Tab inside it, close
 * on Escape, and — the part that is usually forgotten — put focus back on the
 * control that opened it.
 *
 * Without focus return, a keyboard user who opens an opportunity panel and
 * closes it is dropped back at the top of the document and has to tab through
 * the whole page again to reach the next row.
 */
function useDialogBehaviour(
  active: boolean,
  onClose: () => void,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    returnFocusTo.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog so the next Tab lands inside it.
    const focusFirst = window.setTimeout(() => {
      const node = containerRef.current;
      if (!node) return;
      const target = node.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? node).focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const node = containerRef.current;
      if (!node) return;

      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (current === first || !node.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown, true);
      // Restore focus to whatever opened the dialog.
      returnFocusTo.current?.focus?.();
    };
  }, [active, onClose, containerRef]);
}

export function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      aria-hidden
      className="fixed inset-0 z-40 animate-fade-in bg-ink/30 backdrop-blur-[2px]"
    />
  );
}

/** 44×44 minimum, which is the smallest reliable touch target on a phone. */
function CloseButton({
  onClick,
  label = 'Close',
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-lg',
        'text-muted transition-colors hover:bg-canvas hover:text-ink',
        className,
      )}
    >
      <Close className="size-5" />
    </button>
  );
}

/** Right-hand detail panel used for opportunities and AI worker concepts. */
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
  const ref = useRef<HTMLElement | null>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialogBehaviour(open, close, ref);

  if (!open) return null;

  return (
    <>
      <Backdrop onClose={close} />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-dvh w-full flex-col bg-surface shadow-panel',
          'animate-panel-in sm:w-[min(600px,94vw)]',
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0 pt-1">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="display-3 text-ink text-balance">{title}</h2>
          </div>
          <CloseButton onClick={close} label="Close panel" className="-mt-1 -mr-2" />
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">{children}</div>

        {footer && (
          <footer className="border-t border-line bg-canvas/70 px-5 py-4 sm:px-8">
            {footer}
          </footer>
        )}
      </aside>
    </>
  );
}

/** Centred modal used for the Smooth Operator handoff preview. */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  wide = false,
  onDark = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  wide?: boolean;
  onDark?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useDialogBehaviour(open, close, ref);

  if (!open) return null;

  return (
    <>
      <Backdrop onClose={close} />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={cn(
            'relative w-full animate-scale-in rounded-2xl border border-line bg-surface shadow-lift',
            wide ? 'max-w-3xl' : 'max-w-xl',
          )}
        >
          <CloseButton
            onClick={close}
            // Distinct from any "Close" button inside the dialog body, so a
            // screen-reader user is never offered two identically named
            // controls and left to guess which is which.
            label="Close dialog"
            className={cn(
              'absolute top-3 right-3 z-10',
              onDark && 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          />
          {children}
        </div>
      </div>
    </>
  );
}
