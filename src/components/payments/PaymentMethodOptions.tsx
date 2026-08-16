import type { MouseEvent, ReactNode } from "react";

type SwishButtonLabelProps = {
  children: ReactNode;
};

export function SwishButtonLabel({ children }: SwishButtonLabelProps) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 fill-none stroke-current"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M9.5 6h5M10 17.5h4" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

type AlternativePaymentOptionProps = {
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  locale?: "sv" | "en";
};

/** A quiet disclosure for the costlier card-wallet fallback. */
export function AlternativePaymentOption({
  onClick,
  disabled = false,
  busy = false,
  locale = "sv",
}: AlternativePaymentOptionProps) {
  const disclosure = locale === "sv" ? "Övriga betalningsmetoder" : "Other payment methods";
  const method = locale === "sv"
    ? "Kort, Apple Pay eller Google Pay"
    : "Card, Apple Pay or Google Pay";

  const stopDisabledDisclosure = (event: MouseEvent<HTMLElement>) => {
    if (disabled) event.preventDefault();
  };

  return (
    <details className="group mt-2 text-center">
      <summary
        aria-disabled={disabled}
        className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-teal underline decoration-black/25 underline-offset-4 transition-opacity hover:opacity-70 aria-disabled:cursor-not-allowed aria-disabled:opacity-35"
        onClick={stopDisabledDisclosure}
      >
        {disclosure}
        <span aria-hidden="true" className="text-sm no-underline transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="mx-auto flex min-h-11 cursor-pointer items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-teal transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M2.5 9h19M6 15h4" />
        </svg>
        {busy ? (locale === "sv" ? "Startar betalningen…" : "Starting payment…") : method}
      </button>
    </details>
  );
}
