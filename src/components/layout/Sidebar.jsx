import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Repeat,
  Bot,
  Settings,
} from 'lucide-react'

import clsx from 'clsx'

const navigation = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    active: true,
  },

  {
    label: 'Transactions',
    icon: ArrowLeftRight,
  },

  {
    label: 'Analytics',
    icon: BarChart3,
  },

  {
    label: 'Recurring',
    icon: Repeat,
  },

  {
    label: 'AI Assistant',
    icon: Bot,
  },

  {
    label: 'Settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  return (
    <aside className="flex h-full flex-col p-7">
      {/* LOGO */}

      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#9fe870]
            text-[28px]
            font-black
            text-black
          "
        >
          M
        </div>

        <div>
          <h1 className="text-[20px] font-black tracking-tight">
            MoneyPulse
          </h1>

          <p className="mt-1 text-[15px] text-[#868685]">
            Personal Finance OS
          </p>
        </div>
      </div>

      {/* NAV */}

      <nav className="mt-14 flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              className={clsx(
                `
                  flex
                  items-center
                  gap-4
                  rounded-full
                  px-5
                  py-4
                  text-[18px]
                  font-semibold
                  transition-all
                `,

                item.active
                  ? 'bg-[#e2f6d5] text-black'
                  : 'text-[#454745] hover:bg-[#f4f4f4]'
              )}
            >
              <Icon size={22} />

              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* FOOTER */}

      <div className="mt-auto rounded-[28px] bg-[#f4f4f4] p-6">
        <p
          className="
            text-[12px]
            font-bold
            uppercase
            tracking-[0.24em]
            text-[#868685]
          "
        >
          Current Balance
        </p>

        <h2
          className="
            mt-4
            text-[56px]
            font-black
            leading-none
            tracking-[-0.06em]
          "
        >
          Rp12.4M
        </h2>

        <p className="mt-4 text-[17px] text-[#2ead4b]">
          +12.5% this month
        </p>
      </div>
    </aside>
  )
}