import { useNavigate, useParams, Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { useGetStagesByMovieQuery, useGetMovieByIdQuery } from "../store/apiSlice";

export function StageDetails() {

    const { movieId } = useParams();

    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);

    const {
        data: stages,
        isLoading,
        isError,
    } = useGetStagesByMovieQuery(movieId);

    const {
        data: movie,
        Loading,
        Error,
    } = useGetMovieByIdQuery(movieId);

    console.log(stages);
    console.log(movie);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (isLoading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black">

                <div className="h-14 w-14 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

            </div>
        );
    }

    if (isError) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-white">

                Failed to load stages.

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-4 py-10 text-white">

            <div className="mx-auto max-w-6xl">

                {/* HEADER */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-4xl font-extrabold">
                            Stage Details
                        </h1>

                        <p className="mt-2 text-zinc-400">
                            Manage and track movie investment stages
                        </p>

                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2 font-semibold text-white transition hover:border-red-500 hover:bg-red-600/10"
                    >
                        ← Back
                    </button>

                </div>

                {/* TABLE CARD */}

                <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur-md">

                    <div className="border-b border-zinc-800 px-6 py-5">

                        <h2 className="text-xl font-bold text-white">
                            Investment Stages
                        </h2>

                    </div>

                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="min-w-full text-left text-sm">

                            <thead className="bg-zinc-800/80 text-zinc-200">

                                <tr>

                                    <th className="px-6 py-4 font-semibold">
                                        Stage Name
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Stage Amount
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Collected Amount
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Remaining slots
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {stages?.map((stage) => {

                                    const remaining =
                                        Number(stage.stageAmount) -
                                        Number(stage.collectedAmount || 0);

                                    return (

                                        <tr
                                            key={stage.id}
                                            className="border-t border-zinc-800 text-zinc-300 transition hover:bg-zinc-800/40"
                                        >

                                            <td className="px-6 py-5 font-semibold text-white">
                                                {stage.stageName}
                                            </td>

                                            <td className="px-6 py-5">
                                                ${stage.stageAmount}
                                            </td>

                                            <td className="px-6 py-5">
                                                ${stage.collectedAmount || 0}
                                            </td>

                                            <td className="px-6 py-5">
                                                {remaining / movie.slotPrice}
                                            </td>

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold
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

                                            <td className="px-6 py-5">

                                                <button
                                                    disabled={stage.status === "COMPLETED" || stage.status === "PENDING"}
                                                    onClick={() =>
                                                        navigate(`/invest/${stage.id}/${movie.id}`)
                                                    }
                                                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition
                                                                         ${stage.status === "COMPLETED"
                                                            ? "cursor-not-allowed bg-zinc-600 opacity-50"
                                                            : "bg-red-600 hover:bg-red-700"
                                                        } || ${stage.status === "PENDING" ? "cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                                                >
                                                    {stage.status === "COMPLETED"
                                                        ? "Completed"
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

        </div>
    );
}