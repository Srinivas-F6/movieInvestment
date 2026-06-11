import { useNavigate } from "react-router-dom";

export function UserGuidelines() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950 px-4 text-white">
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
                    Investor Guidelines
                </h1>

                <p className="mb-6 text-sm text-zinc-400">
                    Welcome to MovieInvest. This guide explains how investors can
                    discover movie projects, invest in them, track progress, and
                    participate in profit sharing.
                </p>

                {/* 1. Browse Available Projects */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        1. Browse Available Projects
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Investors can explore approved movie projects available for
                        funding. Each project provides details such as the movie
                        title, description, producer information, funding target,
                        slot price, available slots, funding progress, and current
                        project status.
                    </p>
                </div>

                {/* 2. Search and Review Projects */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        2. Search and Review Projects
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Use the search feature to quickly find movie projects and
                        review all available information before making an investment
                        decision. Investors should carefully evaluate project
                        details and funding requirements before investing.
                    </p>
                </div>

                {/* 3. Investment Slots */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        3. Investment Slots
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Every movie project is divided into investment slots with a
                        fixed slot price determined by the producer. Investors may
                        purchase one or more slots, and their investment
                        contribution determines their share in future returns and
                        profit distributions.
                    </p>
                </div>

                {/* 4. Investment Stages */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        4. Investment Stages
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Movie projects are funded through four stages:
                        Pre-Production, Production, Post-Production, and Marketing
                        & Distribution. Investors who participate in earlier stages
                        receive higher profit-sharing benefits compared to those who
                        invest during later stages.
                    </p>
                </div>

                {/* 5. How to Invest */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        5. How to Invest
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        To invest, open a movie project, review the project details,
                        select the number of slots you wish to purchase, and confirm
                        your investment. Once completed, the investment will be
                        reflected in your dashboard.
                    </p>
                </div>

                {/* 6. Track Investments */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        6. Track Your Investments
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Investors can monitor their investments through the
                        dashboard, track project progress, review settlement
                        information, and view return and profit distributions after
                        settlement is completed.
                    </p>
                </div>

                {/* 7. Profit Sharing */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        7. Profit Sharing
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        When a movie generates profit after settlement, 50% of the
                        net profit is allocated to investors and 50% is allocated
                        to the producer. Investor profit distribution is calculated
                        based on investment amount, investment stage, and overall
                        contribution to the project.
                    </p>
                </div>

                {/* 8. Settlement Rules */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        8. Investment Return & Settlement Rules
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Investor returns are determined after settlement. If the
                        movie collection is below 25% of the total movie budget,
                        investors receive 75% of their invested amount and the
                        remaining collected amount is distributed based on
                        investment contribution. If the collection is between 25%
                        and 100% of the total movie budget, investors receive their
                        invested amount along with the applicable interest. If the
                        collection exceeds 100% of the total movie budget,
                        investors receive their invested amount, applicable
                        interest, and their eligible share of profits according to
                        the platform's profit-sharing rules.
                    </p>
                </div>

                {/* Important Notice */}
                <div className="rounded-xl border border-red-900 bg-red-950/30 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-red-400">
                        Important Notice
                    </h2>

                    <p className="text-sm leading-6 text-zinc-300">
                        Investors should carefully review project details before
                        investing. Returns are based on the movie's actual
                        financial performance and settlement results. Earlier-stage
                        investments receive higher profit-sharing benefits
                        according to the platform's stage-based investment model.
                    </p>
                </div>
            </div>
        </div>
    );
}