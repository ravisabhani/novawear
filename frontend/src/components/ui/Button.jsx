import React from 'react';

const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30',
  secondary: 'bg-secondary text-white hover:opacity-90 shadow-sm',
  ghost: 'bg-transparent text-ink hover:bg-primary/5 border border-slate-200',
};

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const base = 'rounded-2xl px-6 py-3 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2';
  const style = VARIANTS[variant] || VARIANTS.primary;

  // ensure we expose an explicit aria-disabled attribute for better a11y
  const ariaProps = {};
  if (props.disabled) ariaProps['aria-disabled'] = 'true';

  return (
    <button className={`${base} ${style} ${className}`} {...ariaProps} {...props}>
      {children}
    </button>
  );
};

export default Button;
