import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetInvestmentsForMovieQuery } from "../store/apiSlice";
import {useNavigate} from "react-router-dom";

export function Investors() {

    const { movieId } = useParams();
    const navigate = useNavigate();

    const {
        data: investments = [],
        isLoading,
        isError,
    } = useGetInvestmentsForMovieQuery(Number(movieId));

    console.log(investments);

    const [search, setSearch] = useState("");
    const [selectedStage, setSelectedStage] = useState("ALL");

    const stages = [
        "ALL",
        ...new Set(
            investments.map(inv => inv.stage.stageName)
        )
    ];

    const filteredInvestments = useMemo(() => {
        return investments.filter(inv => {

            const matchesStage =
                selectedStage === "ALL" ||
                inv.stage.stageName === selectedStage;

            const matchesSearch =
                inv.investorName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                inv.investorEmail
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesStage && matchesSearch;
        });
    }, [investments, search, selectedStage]);

    if (isLoading) {
        return <h2>Loading investors...</h2>;
    }

    if (isError) {
        return <h2>Failed to load investors</h2>;
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">

            {/* Header */}

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-white">
                        Investors
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        View and manage movie investors
                    </p>

                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:border-red-500 hover:text-red-400"
                >
                    ← Back
                </button>

            </div>

            {/* Filters */}

            <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg backdrop-blur">

                <div className="flex flex-col gap-4 md:flex-row">

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                    />

                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                    >
                        {stages.map((stage) => (
                            <option key={stage} value={stage}>
                                {stage}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* Investors Table */}

            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-lg backdrop-blur">

                <div className="border-b border-zinc-800 px-6 py-4">

                    <h2 className="text-lg font-semibold text-white">
                        Investor List
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-zinc-800/50">

                            <tr className="text-left text-sm text-zinc-300">

                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Stage</th>
                                <th className="px-6 py-4">Slots</th>
                                <th className="px-6 py-4">Amount</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredInvestments.map((inv) => (

                                <tr
                                    key={inv.investmentId}
                                    className="border-t border-zinc-800 hover:bg-zinc-800/20"
                                >

                                    <td className="px-6 py-4 font-medium text-white">
                                        {inv.investorName}
                                    </td>

                                    <td className="px-6 py-4 text-zinc-300">
                                        {inv.investorEmail}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                                            {inv.stage.stageName}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4 text-zinc-300">
                                        {inv.slotsToBuy}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-green-400">
                                        ₹{inv.amount}
                                    </td>

                                </tr>

                            ))}

                            {filteredInvestments.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-zinc-500"
                                    >
                                        No investors found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}