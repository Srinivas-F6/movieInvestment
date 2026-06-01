import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetInvestmentsForMovieQuery } from "../store/apiSlice";

export function Investors() {

    const { movieId } = useParams();

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
        <div className="min-h-screen bg-zinc-950 p-8 text-white">

            <h1 className="mb-8 text-3xl font-bold">
                Investors
            </h1>

            {/* FILTERS */}

            <div className="mb-6 flex flex-wrap gap-4">

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2"
                />

                <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2"
                >
                    {stages.map(stage => (
                        <option key={stage} value={stage}>
                            {stage}
                        </option>
                    ))}
                </select>

            </div>

            {/* TABLE */}

            <div className="overflow-hidden rounded-xl border border-zinc-800">

                <table className="w-full">

                    <thead className="bg-zinc-900">

                    <tr>
                        <th className="px-5 py-4 text-left">
                            Investor
                        </th>

                        <th className="px-5 py-4 text-left">
                            Email
                        </th>

                        <th className="px-5 py-4 text-left">
                            Stage
                        </th>

                        <th className="px-5 py-4 text-left">
                            Slots
                        </th>

                        <th className="px-5 py-4 text-left">
                            Amount
                        </th>
                    </tr>

                    </thead>

                    <tbody>

                    {filteredInvestments.map(inv => (

                        <tr
                            key={inv.investmentId}
                            className="border-t border-zinc-800"
                        >

                            <td className="px-5 py-4">
                                {inv.investorName}
                            </td>

                            <td className="px-5 py-4">
                                {inv.investorEmail}
                            </td>

                            <td className="px-5 py-4">
                                {inv.stage.stageName}
                            </td>

                            <td className="px-5 py-4">
                                {inv.slotsToBuy}
                            </td>

                            <td className="px-5 py-4">
                                ₹{inv.amount}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}