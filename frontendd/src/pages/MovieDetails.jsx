import { useParams, Navigate, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import {
    useGetMovieByIdQuery,
    useGetStagesByMovieQuery,
} from '../store/apiSlice';

export function MovieDetails() {

    const { movieId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const {
        data: movie,
        isLoading,
        isError,
    } = useGetMovieByIdQuery(movieId);

    console.log(movie);

    const {
        data: movies,
        isLoading: moviesLoading,
        isError: moviesError,
    } = useGetStagesByMovieQuery(movieId);


    console.log(movies);

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

    // const progress = (movie.currentFunding / movie.targetFunding) * 100;

    return (

        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">

            <div className="mx-auto max-w-7xl px-4 py-10">

                {/* BACK BUTTON */}

                {/* BACK BUTTON */}

                <button
                    onClick={() => navigate(-1)}
                    className="group mb-8 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-5 py-2.5 text-sm font-semibold text-zinc-300 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-red-500 hover:bg-red-600/10 hover:text-white"
                >

                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                    </span>

                    Back

                </button>

                {/* MAIN GRID */}

                <div className="flex justify-center">

                    {/* RIGHT SIDE */}

                    <div className="flex w-full max-w-4xl flex-col rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-md">

                        {/* TOP HEADER */}

                        <div className="border-b border-zinc-800 pb-6">

                            <span className="rounded-full bg-red-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                {movie.status}
                            </span>

                            <h1 className="mt-4 text-4xl font-extrabold leading-tight lg:text-5xl">
                                {movie.title}
                            </h1>

                            <p className="mt-5 text-sm leading-7 text-zinc-400 lg:text-base">
                                {movie.description}
                            </p>

                        </div>

                        {/* CAST + CREW */}

                        <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">

                            {/* CAST */}

                            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-5">

                                <h2 className="mb-4 text-lg font-bold text-white">
                                    Cast
                                </h2>

                                <div className="flex flex-wrap gap-2">

                                    {movie.cast?.map((actor, index) => (

                                        <span
                                            key={index}
                                            className="rounded-full border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-red-500 hover:text-white"
                                        >
                                            {actor}
                                        </span>

                                    ))}

                                </div>

                            </div>

                            {/* CREW */}

                            <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">

                                <h2 className="mb-4 text-lg font-bold text-white">
                                    Crew
                                </h2>

                                <div className="flex flex-wrap gap-2">

                                    {movie.crew?.map((member, index) => (

                                        <span
                                            key={index}
                                            className="rounded-full border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-red-500 hover:text-white"
                                        >
                                            {member}
                                        </span>

                                    ))}

                                </div>

                            </div>

                        </div>

                        {/* INVESTMENT STAGES */}

                        <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">

                            <div className="mb-5 flex items-center justify-between">

                                <h2 className="text-xl font-bold text-white">
                                    Investment Stages
                                </h2>

                                <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-semibold text-red-400">
                                    {movies?.length || 0} Stages
                                </span>

                            </div>

                            {moviesLoading ? (

                                <p className="text-sm text-zinc-400">
                                    Loading stages...
                                </p>

                            ) : moviesError ? (

                                <p className="text-sm text-red-500">
                                    Failed to load stages
                                </p>

                            ) : (

                                <div className="overflow-x-auto rounded-2xl border border-zinc-800">

                                    <table className="min-w-full overflow-hidden text-left text-sm">

                                        <thead className="bg-zinc-800/80 text-zinc-200">

                                            <tr>

                                                <th className="px-5 py-4 font-semibold">
                                                    Stage
                                                </th>

                                                <th className="px-5 py-4 font-semibold">
                                                    Total slots
                                                </th>

                                                <th className="px-5 py-4 font-semibold">
                                                    Avaliable slots
                                                </th>

                                                <th className="px-5 py-4 font-semibold">
                                                    Status
                                                </th>
                                                <th className="px-5 py-4 font-semibold">
                                                    Investment
                                                </th>
                                                

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {movies?.map((stage) => (

                                                <tr
                                                    key={stage.id}
                                                    className="border-t border-zinc-800 text-zinc-300 transition hover:bg-zinc-800/40"
                                                >

                                                    <td className="px-4 py-3 font-semibold text-white">
                                                        {stage.stageName}
                                                    </td>

                                                    <td className="px-5 py-4 text-zinc-300">
                                                        {stage.stageAmount / movie.slotPrice}
                                                    </td>

                                                    <td className="px-5 py-4 text-zinc-300">
                                                        {(stage.stageAmount / movie.slotPrice) - (stage.collectedAmount / movie.slotPrice)}
                                                    </td>

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-bold
                                                    ${stage.status === "COMPLETED"
                                                                    ? "bg-green-500/20 text-green-400"
                                                                    : stage.status === "ONGOING"
                                                                        ? "bg-blue-500/20 text-blue-400"
                                                                        : "bg-yellow-500/20 text-yellow-400"
                                                                }`}
                                                        >
                                                            {stage.status}
                                                        </span>

                                                    </td>
                                                    <td className="px-5 py-4">

                                                        <button
                                                            disabled={stage.status === "COMPLETED"}
                                                            onClick={() =>
                                                                navigate(`/invest/${stage.id}/${movie.id}`)
                                                            }
                                                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition
                                                                         ${stage.status === "COMPLETED"
                                                                    ? "cursor-not-allowed bg-zinc-600 opacity-50"
                                                                    : "bg-red-600 hover:bg-red-700"
                                                                }`}
                                                        >
                                                            {stage.status === "COMPLETED"
                                                                ? "Completed"
                                                                : "Invest"}
                                                        </button>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>


                    </div>

                </div>

            </div>

        </div>
    );


}
