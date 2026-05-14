import clsx from 'clsx'

const variants = {
  primary: `
    bg-[var(--color-primary)]
    text-[var(--color-ink)]

    hover:bg-[var(--color-primary-hover)]
  `,

  secondary: `
    bg-[var(--color-surface)]
    text-[var(--color-ink)]

    border
    border-[var(--color-border)]

    hover:bg-[var(--color-surface-soft)]
  `,
}

export default function Button({
  children,
  className,
  variant = 'primary',
}) {
  return (
    <button
      className={clsx(
        `
          inline-flex
          items-center
          justify-center

          rounded-full

          px-6
          py-3

          text-sm
          font-semibold

          transition-all
          duration-300

          active:scale-[0.98]
        `,

        variants[variant],

        className
      )}
    >
      {children}
    </button>
  )
}