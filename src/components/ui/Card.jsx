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
          rounded-3xl

          border
          border-(--color-border)

          bg-(--color-surface)

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