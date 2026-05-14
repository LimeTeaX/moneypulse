import {
  Wallet,
  TrendingUp,
  ArrowDownRight,
  ArrowRight,
  Plus,
  BarChart3,
} from 'lucide-react'

import Sidebar from './components/layout/Sidebar'

import Card from './components/ui/Card'
import Button from './components/ui/Button'

const stats = [
  {
    title: 'Total Balance',
    value: 'Rp12.450.000',
    change: '+12.5%',
    icon: Wallet,
    positive: true,
  },

  {
    title: 'Monthly Income',
    value: 'Rp8.200.000',
    change: '+8.1%',
    icon: TrendingUp,
    positive: true,
  },

  {
    title: 'Monthly Expense',
    value: 'Rp3.850.000',
    change: '-2.4%',
    icon: ArrowDownRight,
    positive: false,
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-[#e8ebe6] p-6">
      <div
        className="
          flex
          min-h-[calc(100vh-48px)]

          overflow-hidden

          rounded-[36px]

          bg-white
        "
      >
        {/* SIDEBAR */}

        <div
          className="
            w-[250px]
            shrink-0

            border-r
            border-black/5
          "
        >
          <Sidebar />
        </div>

        {/* CONTENT */}

        <main className="flex-1 overflow-y-auto">
          <div
            className="
              mx-auto

              max-w-[1280px]

              px-20
              py-16
            "
          >
            {/* HERO */}

            <section className="max-w-[720px]">
              <p
                className="
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-[0.28em]

                  text-[#5d7c43]
                "
              >
                Financial Overview
              </p>

              <h1
                className="
                  mt-5

                  text-[60px]
                  font-black
                  leading-[0.92]
                  tracking-[-0.07em]

                  text-[#0e0f0c]
                "
              >
                Control your money
                <br />
                with clarity.
              </h1>

              <p
                className="
                  mt-6

                  max-w-[620px]

                  text-[18px]
                  leading-[1.7]

                  text-[#454745]
                "
              >
                Track your balance,
                monitor expenses,
                and grow your financial
                health with a cleaner,
                smarter workflow.
              </p>

              <div className="mt-10 flex items-center gap-4">
                <Button className="h-[56px] px-7 text-[16px]">
                  <Plus size={18} />

                  <span>Add Transaction</span>
                </Button>

                <Button
                  variant="secondary"
                  className="h-[56px] px-7 text-[16px]"
                >
                  <BarChart3 size={18} />

                  <span>Analytics</span>
                </Button>
              </div>
            </section>

            {/* FEATURED */}

            <section
              className="
                mt-20

                grid
                gap-8

                grid-cols-[1.3fr_0.9fr]
              "
            >
              {/* BALANCE */}

              <Card
                className="
                  rounded-[32px]

                  bg-[#f6f8f3]

                  p-8
                "
              >
                <p
                  className="
                    text-[18px]
                    font-semibold

                    text-[#454745]
                  "
                >
                  Available Balance
                </p>

                <h2
                  className="
                    mt-5

                    text-[56px]
                    font-black
                    leading-none
                    tracking-[-0.06em]

                    text-[#0e0f0c]
                  "
                >
                  Rp12.450.000
                </h2>

                <div
                  className="
                    mt-7

                    inline-flex
                    items-center

                    rounded-full

                    bg-[#e2f6d5]

                    px-4
                    py-2

                    text-[15px]
                    font-semibold

                    text-[#2d6a1f]
                  "
                >
                  +18.2% this month
                </div>
              </Card>

              {/* SAVINGS */}

              <Card className="rounded-[32px] p-8">
                <p
                  className="
                    text-[18px]
                    font-semibold

                    text-[#454745]
                  "
                >
                  Savings Goal
                </p>

                <h2
                  className="
                    mt-5

                    text-[52px]
                    font-black
                    leading-none
                    tracking-[-0.06em]
                  "
                >
                  72%
                </h2>

                <div
                  className="
                    mt-7

                    h-3

                    rounded-full

                    bg-[#edf0eb]
                  "
                >
                  <div
                    className="
                      h-full
                      w-[72%]

                      rounded-full

                      bg-[#9fe870]
                    "
                  />
                </div>

                <p
                  className="
                    mt-6

                    text-[17px]
                    leading-[1.7]

                    text-[#454745]
                  "
                >
                  You are on track to reach
                  your emergency fund target.
                </p>
              </Card>
            </section>

            {/* STATS */}

            <section
              className="
                mt-8

                grid
                gap-8

                grid-cols-3
              "
            >
              {stats.map((item) => {
                const Icon = item.icon

                return (
                  <Card
                    key={item.title}
                    className="
                      rounded-[32px]

                      p-7
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                      "
                    >
                      <div
                        className={`
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center

                          rounded-[18px]

                          ${
                            item.positive
                              ? `
                                bg-[#e2f6d5]
                                text-[#163300]
                              `
                              : `
                                bg-red-100
                                text-red-600
                              `
                          }
                        `}
                      >
                        <Icon size={24} />
                      </div>

                      <button
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center

                          rounded-full

                          bg-[#f4f4f4]
                        "
                      >
                        <ArrowRight size={17} />
                      </button>
                    </div>

                    <div className="mt-8">
                      <p
                        className="
                          text-[16px]

                          text-[#6d6d6d]
                        "
                      >
                        {item.title}
                      </p>

                      <h3
                        className="
                          mt-3

                          text-[36px]
                          font-black
                          leading-none
                          tracking-[-0.06em]
                        "
                      >
                        {item.value}
                      </h3>
                    </div>

                    <div
                      className={`
                        mt-6

                        inline-flex

                        rounded-full

                        px-3
                        py-2

                        text-[14px]
                        font-semibold

                        ${
                          item.positive
                            ? `
                              bg-[#e2f6d5]
                              text-[#2ead4b]
                            `
                            : `
                              bg-red-100
                              text-red-600
                            `
                        }
                      `}
                    >
                      {item.change}
                    </div>
                  </Card>
                )
              })}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}