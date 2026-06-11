import { useNavigate } from "react-router-dom";

export function ProducerGuidelines() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 px-4  text-white">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="group mb-4 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all duration-300 hover:border-red-500 hover:bg-red-600/10 hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back
        </button>

        <h1 className="mb-2 text-3xl font-bold text-red-500">
          Producer Guidelines
        </h1>

        <p className="mb-6 text-sm text-zinc-400">
          Welcome to MovieInvest. This guide explains how producers
          can create movie projects, raise funds, manage production
          stages, and complete the settlement process.
        </p>

        {/* 1 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            1. Create a Movie Project
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            Producers can create movie projects by providing all
            required movie details, budget information, investment
            slot details, and supporting project information.
          </p>
        </div>

        {/* 2 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            2. Define and Manage Funding Stages
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            Movie projects progress through four stages:
            Pre-Production, Production, Post-Production, and
            Marketing & Distribution. Each stage requires separate
            funding and must be created individually by the
            producer. After completing one stage, the producer can
            create the next stage and request funding for it.
            Investor profit-sharing benefits are determined by the
            stage in which investments are made.
          </p>
        </div>

        {/* 3 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            3. Submit Security Details
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            Producers must provide valid security and property details
            with a combined value of at least 75% of the total movie
            budget. These assets help protect investor interests and
            support settlement obligations.
          </p>
        </div>

        {/* 4 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            4. Project Approval Process
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            All movie projects are reviewed by platform
            administrators before becoming available for investment.
            Only approved projects can receive investments through
            the platform.
          </p>
        </div>

        {/* 5 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            5. Receive and Manage Investments
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            Once approved, investors can fund the project through
            the platform. Producers can monitor funding progress,
            investor participation, and stage completion through
            their dashboard.
          </p>
        </div>

        {/* 6 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            6. Funding Responsibility
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            If a funding stage does not receive its required
            investment amount from investors, the producer is
            responsible for providing the remaining funds needed to
            complete that stage and continue the project.
          </p>
        </div>

        {/* 7 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            7. Platform-Based Funding
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            All investments related to a movie project must be
            conducted through the platform. This ensures
            transparency, accurate investment tracking, and proper
            settlement calculations.
          </p>
        </div>

        {/* 8 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            8. Movie Release & Settlement
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            After the movie is released, producers must submit
            revenue, expenses, and other required financial
            information to complete the settlement process.
          </p>
        </div>

        {/* 9 */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            9. Profit Sharing
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            When a movie generates profit after settlement, 50% of
            the net profit is allocated to investors and 50% is
            allocated to the producer according to the platform's
            profit-sharing rules.
          </p>
        </div>

        {/* Notice */}
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-4">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            Important Notice
          </h2>

          <p className="text-sm leading-6 text-zinc-300">
            Producers are responsible for providing accurate
            project, funding, and settlement information. By
            creating a movie project on the platform, producers
            agree to follow the platform's funding, settlement, and
            profit-sharing policies.
          </p>
        </div>
      </div>
    </div>
  );
}