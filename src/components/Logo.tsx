type Props = {
  /** lime (green) for dark backgrounds, black/sand for light ones */
  variant?: "green" | "black" | "sand";
  className?: string;
};

/** The Beach official wordmark (brand SVG). */
export default function Logo({ variant = "green", className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/logo/Wordmark/Transparent/theBeach-wordmark-${variant}-RGB.svg`}
      alt="The Beach"
      className={className}
    />
  );
}
