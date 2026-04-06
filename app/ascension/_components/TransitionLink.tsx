"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function TransitionLink({
  href,
  children,
  className,
  external = false,
  target,
  rel,
  onClick,
}: TransitionLinkProps) {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (external) return; // let browser handle external links normally
    e.preventDefault();
    onClick?.();
    setTransitioning(true);
    setTimeout(() => router.push(href), 380);
  };

  return (
    <>
      {transitioning && (
        <div className="fixed inset-0 z-[99998] bg-[#030005] pointer-events-none asc-animate-fade-to-black" />
      )}
      <a
        href={href}
        onClick={handleClick}
        className={className}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    </>
  );
}
