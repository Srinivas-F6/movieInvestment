import { useParams, Navigate, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import {
    useGetMovieByIdQuery,
    useGetStagesByMovieQuery,
} from '../store/apiSlice';

export function MovieDetails() {

    const { movieId } = useParams();
    const navigate = useNavigate();
    const { token, role } = useSelector((state) => state.auth);

    const {
        data: movie,
        isLoading,
        isError,
    } = useGetMovieByIdQuery(movieId);


    const {
        data: movies,
        isLoading: moviesLoading,
        isError: moviesError,
    } = useGetStagesByMovieQuery(movieId);

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

    if (isError || !movie) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-black text-white">

                Failed to load movie details.

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">

            <div className="mx-auto max-w-7xl px-4 py-6">

                {/* BACK BUTTON */}

                <button
                    onClick={() => navigate(-1)}
                    className="group mb-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-300 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-red-500 hover:bg-red-600/10 hover:text-white"
                >
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>
                    Back
                </button>

                {/* MOVIE HEADER */}

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl font-bold lg:text-4xl">
                                        {movie.title}
                                    </h1>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider
            ${movie.status === "APPROVED"
                                                ? "bg-green-500/20 text-green-400"
                                                : movie.status === "PENDING"
                                                    ? "bg-yellow-500/20 text-yellow-400"
                                                    : "bg-red-500/20 text-red-400"
                                            }`}
                                    >
                                        {movie.status}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-zinc-400">Slot Price</p>
                                    <p className="text-xl font-bold text-green-400">
                                        ₹{movie.slotPrice?.toLocaleString()}
                                    </p>
                                </div>

                            </div>

                            <p className="mt-3 text-sm text-zinc-400">
                                {movie.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CAST + CREW */}

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">

                        <h2 className="mb-4 text-lg font-bold text-white">
                            🎭 Cast
                        </h2>

                        {movie.cast?.length > 0 ? (
                            <div className="space-y-2">
                                {movie.cast.map((actor, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300"
                                    >
                                        {actor}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No cast available.
                            </p>
                        )}

                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">

                        <h2 className="mb-4 text-lg font-bold text-white">
                            🎬 Crew
                        </h2>

                        {movie.crew?.length > 0 ? (
                            <div className="space-y-2">
                                {movie.crew.map((member, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300"
                                    >
                                        {member}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No crew available.
                            </p>
                        )}

                    </div>

                </div>

                {/* INVESTMENT STAGES */}

                {role !== "ADMIN" && (

                    <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-xl backdrop-blur-md">

                        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

                            <h2 className="text-xl font-bold text-white">
                                Investment Stages
                            </h2>

                            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                                {movies?.length || 0} Stages
                            </span>

                        </div>

                        {moviesLoading ? (

                            <div className="flex justify-center py-8">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
                            </div>

                        ) : movies?.length === 0 ? (

                            <div className="p-8 text-center text-sm text-zinc-500">
                                No stages created yet.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="min-w-full text-sm">

                                    <thead className="bg-zinc-800/80 text-zinc-300">

                                        <tr>

                                            <th className="px-5 py-3 text-left font-semibold">
                                                Stage
                                            </th>

                                            <th className="px-5 py-3 text-left font-semibold">
                                                Total Slots
                                            </th>

                                            <th className="px-5 py-3 text-left font-semibold">
                                                Available Slots
                                            </th>

                                            <th className="px-5 py-3 text-left font-semibold">
                                                Status
                                            </th>

                                            <th className="px-5 py-3 text-left font-semibold">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {movies?.map((stage) => {

                                            const totalSlots =
                                                stage.stageAmount / movie.slotPrice;

                                            const availableSlots =
                                                totalSlots -
                                                stage.collectedAmount / movie.slotPrice;

                                            return (

                                                <tr
                                                    key={stage.id}
                                                    className="border-t border-zinc-800 hover:bg-zinc-800/30"
                                                >

                                                    <td className="px-5 py-3 font-medium text-white">
                                                        {stage.stageName}
                                                    </td>

                                                    <td className="px-5 py-3 text-zinc-300">
                                                        {totalSlots}
                                                    </td>

                                                    <td className="px-5 py-3 text-zinc-300">
                                                        {availableSlots}
                                                    </td>

                                                    <td className="px-5 py-3">

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

                                                    <td className="px-5 py-3">

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
                                                            className={`rounded-md px-3 py-1.5 text-xs font-medium text-white transition bg-red-600
                                                      ${stage.status !== "ACTIVE" ? "cursor-not-allowed" : "hover:bg-red-700"}`}
                                                        >
                                                            Invest
                                                        </button>

                                                    </td>

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>
                )}

            </div>

        </div>
    );


}
