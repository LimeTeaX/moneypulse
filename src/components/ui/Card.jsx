import clsx from 'clsx'

export default function Card({
  children,
  className,
  hover = false,
}) {
  return (
    <div
      className={clsx(
        `
          rounded-[24px]

          border
          border-[var(--color-border)]

          bg-[var(--color-surface)]

          p-6

          shadow-[0px_8px_24px_rgba(14,15,12,0.04)]

          transition-all
          duration-300
        `,

        hover &&
          `
            hover:-translate-y-1
          `,

        className
      )}
    >
      {children}
    </div>
  )
}