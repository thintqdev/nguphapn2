import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type PageBackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export default function PageBackLink({
  href,
  label,
  className = "",
}: PageBackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-0.5 text-[13px] font-semibold text-accent hover:opacity-80 active:scale-[0.98] transition-all mb-3 -ml-0.5 ${className}`}
    >
      <ChevronLeft size={17} strokeWidth={2.5} />
      {label}
    </Link>
  );
}
