import { useNavigate, useParams, Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import {
    useGetStagesByMovieQuery,
    useGetMovieByIdQuery
} from "../store/apiSlice";

export function StageDetails() {

    const { movieId } = useParams();

    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);

    // STAGES QUERY
    const {
        data: stages,
        isLoading,
        isError,
    } = useGetStagesByMovieQuery(movieId);
    console.log(isLoading);
    console.log(isError);

    // MOVIE QUERY
    const {
        data: movie,
        isLoading: movieLoading,
        isError: movieError,
    } = useGetMovieByIdQuery(movieId);

    console.log(stages);
    console.log(movie);

    // AUTH CHECK
    if (!token) {
        return <Navigate to="/login" />;
    }

    // LOADING
    if (isLoading || movieLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
            </div>
        );
    }

    if (isError || movieError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
                    Failed to load data.
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-5">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">

                <div>
                    <h1 className="text-xl font-bold text-white">
                        Stage Details
                    </h1>

                    <p className="mt-1 text-xs text-zinc-400">
                        Manage and track movie investment stages
                    </p>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:border-red-500 hover:text-red-400"
                >
                    ← Back
                </button>

            </div>

            {/* Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 shadow-lg backdrop-blur">

                <div className="border-b border-zinc-800 px-4 py-3">

                    <h2 className="text-base font-semibold text-white">
                        Investment Stages
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-zinc-800/50">

                            <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">

                                <th className="px-4 py-3">Stage</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Collected</th>
                                <th className="px-4 py-3">Slots Left</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {stages?.map((stage) => {

                                const remaining =
                                    Number(stage.stageAmount) -
                                    Number(stage.collectedAmount || 0);

                                const remainingSlots =
                                    movie?.slotPrice
                                        ? Math.floor(
                                            remaining / movie.slotPrice
                                        )
                                        : 0;

                                return (
                                    <tr
                                        key={stage.id}
                                        className="border-t border-zinc-800 hover:bg-zinc-800/20"
                                    >

                                        <td className="px-4 py-3 font-medium text-white">
                                            {stage.stageName}
                                        </td>

                                        <td className="px-4 py-3 text-zinc-300">
                                            ₹{stage.stageAmount}
                                        </td>

                                        <td className="px-4 py-3 text-zinc-300">
                                            ₹{stage.collectedAmount || 0}
                                        </td>

                                        <td className="px-4 py-3 text-zinc-300">
                                            {remainingSlots}
                                        </td>

                                        <td className="px-4 py-3">

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium
                                            ${stage.status === "COMPLETED"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : stage.status === "ACTIVE"
                                                            ? "bg-blue-500/20 text-blue-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                            >
                                                {stage.status}
                                            </span>

                                        </td>

                                        <td className="px-4 py-3">

                                            <button
                                                disabled={
                                                    stage.status === "COMPLETED" ||
                                                    stage.status === "HOLD" ||
                                                    stage.status === "PENDING"
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/invest/${stage.id}/${movie.id}`
                                                    )
                                                }
                                                className={`rounded-md px-3 py-1.5 text-xs font-medium text-white transition
                                            ${stage.status === "COMPLETED" ||
                                                        stage.status === "HOLD" ||
                                                        stage.status === "PENDING"
                                                        ? "cursor-not-allowed bg-zinc-700 opacity-50"
                                                        : "bg-red-600 hover:bg-red-700"
                                                    }`}
                                            >
                                                {stage.status === "COMPLETED"
                                                    ? "Completed"
                                                    : stage.status === "HOLD"
                                                        ? "On Hold"
                                                        : stage.status === "PENDING"
                                                            ? "Pending"
                                                            : "Invest"}
                                            </button>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}