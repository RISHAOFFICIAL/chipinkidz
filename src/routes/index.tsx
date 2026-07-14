import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* ============================================================ */}
      {/* NAVBAR */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
            <span className="text-2xl">🧒</span>
            <span>ChipIn Kids</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 sm:flex">
            <a href="#how-it-works" className="transition hover:text-brand-600">
              How It Works
            </a>
            <a href="#for-orgs" className="transition hover:text-brand-600">
              For Organizations
            </a>
            <a href="#for-parents" className="transition hover:text-brand-600">
              For Parents
            </a>
            <a
              href="#get-started"
              className="rounded-full bg-brand-500 px-5 py-2 text-white transition hover:bg-brand-600"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white px-6 pb-24 pt-16 sm:pt-24">
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-teal-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            Launching in Michigan 🇺🇸
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Raise money for the{" "}
            <span className="text-brand-500">kids you care about</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            ChipIn Kids helps schools, teams, and parents raise funds through
            compliant digital raffles and donation fundraisers — all in one
            platform built for Michigan.
          </p>

          {/* Two CTA tracks */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#for-orgs"
              className="flex w-full max-w-xs items-center justify-center gap-3 rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-600 sm:text-lg"
            >
              <span>🏫</span>
              I'm an Organization
              <span className="text-xs font-normal opacity-75">(Raffles)</span>
            </a>
            <a
              href="#for-parents"
              className="flex w-full max-w-xs items-center justify-center gap-3 rounded-xl border-2 border-brand-200 bg-white px-8 py-4 text-base font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 sm:text-lg"
            >
              <span>👨‍👩‍👧‍👦</span>
              I'm a Parent
              <span className="text-xs font-normal opacity-75">
                (Donation Fundraiser)
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS */}
      {/* ============================================================ */}
      <section id="how-it-works" className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Two ways to raise money — pick the path that fits you.
            </p>
          </div>

          {/* Track A — Organizations */}
          <div id="for-orgs" className="mt-16">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-8 sm:p-12">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-lg text-white">
                  🏫
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Organizations
                </h3>
                <span className="rounded-full bg-brand-200 px-3 py-0.5 text-xs font-semibold text-brand-800">
                  Track A — Raffles
                </span>
              </div>
              <div className="mt-8 grid gap-8 sm:grid-cols-3">
                {[
                  {
                    step: "1",
                    icon: "📋",
                    title: "Get Licensed",
                    desc: "We help you apply for your MGCB charitable gaming license. Our platform handles the compliance.",
                  },
                  {
                    step: "2",
                    icon: "🎟️",
                    title: "Create a Raffle",
                    desc: "Set up your digital raffle in minutes — set ticket prices, prizes, and campaign dates.",
                  },
                  {
                    step: "3",
                    icon: "🎉",
                    title: "Sell Tickets & Win",
                    desc: "Share your campaign link. We process payments, pick winners, and handle reporting.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                        {item.step}
                      </span>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <span className="font-medium text-brand-600">✅</span>{" "}
                Compliant with Michigan Gaming Control Board regulations
              </div>
            </div>
          </div>

          {/* Track B — Parents */}
          <div id="for-parents" className="mt-10">
            <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-8 sm:p-12">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-lg text-white">
                  👨‍👩‍👧‍👦
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  For Parents
                </h3>
                <span className="rounded-full bg-teal-200 px-3 py-0.5 text-xs font-semibold text-teal-800">
                  Track B — Donation + Giveaway
                </span>
              </div>
              <div className="mt-8 grid gap-8 sm:grid-cols-3">
                {[
                  {
                    step: "1",
                    icon: "💝",
                    title: "Start a Campaign",
                    desc: "Tell your story — why you're raising money for your child's sports, lessons, or needs.",
                  },
                  {
                    step: "2",
                    icon: "🙌",
                    title: "Accept Donations",
                    desc: "Supporters donate any amount. As a thank-you, each donor gets an entry into the giveaway.",
                  },
                  {
                    step: "3",
                    icon: "🎁",
                    title: "Giveaway Drawing",
                    desc: "No purchase necessary to enter. We randomly select a winner and handle prize fulfillment.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                        {item.step}
                      </span>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <span className="font-medium text-teal-600">✅</span>{" "}
                No purchase necessary to enter or win. Donations are voluntary
                gifts.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST SIGNALS */}
      {/* ============================================================ */}
      <section className="bg-gray-50 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Built for Trust & Compliance
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "⚖️",
                title: "Compliant in Michigan",
                desc: "Designed with Michigan Gaming Control Board regulations. Both tracks are structured for legal compliance.",
              },
              {
                icon: "🔒",
                title: "Stripe-Powered Payments",
                desc: "All payments handled securely through Stripe. Donations and ticket purchases are encrypted and safe.",
              },
              {
                icon: "💰",
                title: "Free to Start",
                desc: "No setup fees, no monthly minimums. We only take a small percentage when you raise money.",
              },
              {
                icon: "🛡️",
                title: "Winner Selection",
                desc: "Automated, random winner selection. No bias, no manual intervention — provably fair.",
              },
              {
                icon: "🗺️",
                title: "Geolocation Verified",
                desc: "Participants are verified to be in Michigan, ensuring compliance with state regulations.",
              },
              {
                icon: "📊",
                title: "Automated Reporting",
                desc: "Post-event reports for MGCB compliance. IRS prize reporting for winners over $600.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA */}
      {/* ============================================================ */}
      <section
        id="get-started"
        className="bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-20 text-white sm:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to start fundraising?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Join the waitlist for our Michigan launch. We'll let you know as
            soon as we're live.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl border-0 px-5 py-3 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-brand-600 shadow-lg transition hover:bg-brand-50"
            >
              Get Updates
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <span className="text-lg">🧒</span>
            ChipIn Kids
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="transition hover:text-brand-600">
              Terms
            </a>
            <a href="#" className="transition hover:text-brand-600">
              Privacy
            </a>
            <a href="#" className="transition hover:text-brand-600">
              Contact
            </a>
          </div>
          <p>© {new Date().getFullYear()} ChipIn Kids. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}