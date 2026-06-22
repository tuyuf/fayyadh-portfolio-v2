"use client";

/**
 * Reusable button component with primary/secondary/tertiary variants
 * matching the Viktor Oddy design system.
 */
export default function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 cursor-pointer";

  const variants = {
    primary: `${baseStyles} bg-[#051A24] text-white px-7 py-3 shadow-primary-btn hover:opacity-90`,
    secondary: `${baseStyles} bg-white text-[#051A24] px-7 py-3 shadow-secondary-btn hover:opacity-80`,
    tertiary: `${baseStyles} bg-white text-[#051A24] px-7 py-3 shadow-secondary-btn hover:opacity-80`,
  };

  const combinedClass = `${variants[variant] || variants.primary} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
}
