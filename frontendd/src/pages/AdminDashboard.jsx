import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
    useGetMoviesQuery,
    useUpdateMovieStatusMutation,
    useUpdateStageStatusMutation,
} from '../store/apiSlice';

const AdminDashboard = () => {

    const navigate = useNavigate();

    // ================= SEARCH =================

    const [search, setSearch] = useState('');

    const {
        data: movies,
        isLoading,
        isError,
    } = useGetMoviesQuery();

    const [updateMovieStatus] =
        useUpdateMovieStatusMutation();

    const [updateStageStatus] =
        useUpdateStageStatusMutation();

    // ================= FILTERED MOVIES =================

    const filteredMovies = movies?.filter((movie) =>
        movie.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    console.log(filteredMovies);
    // ================= MOVIE STATUS =================

    const handleMovieStatus = async (
        movieId,
        status
    ) => {

        try {

            await updateMovieStatus({
                movieId,
                status,
            }).unwrap();

            alert(`Movie ${status}`);

        } catch (err) {

            console.error(err);

            alert('Failed to update movie status');
        }
    };

    // ================= STAGE STATUS =================

    const handleStageStatus = async (
        stageId,
        status
    ) => {

        try {

            await updateStageStatus({
                stageId,
                status,
            }).unwrap();

            alert(`Stage ${status}`);

        } catch (err) {

            console.error(err);

            alert('Failed to update stage status');
        }
    };

    // ================= LOADING =================

    if (isLoading) {

        return (

            <div className="flex h-screen items-center justify-center bg-black">

                <div className="h-14 w-14 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

            </div>
        );
    }

    // ================= ERROR =================

    if (isError) {

        return (

            <div className="flex h-screen items-center justify-center bg-black text-2xl text-red-500">

                Failed to load admin dashboard.

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-black px-6 py-10 text-white">

            {/* HEADER */}

            <div className="mb-10 flex items-center justify-between">

                <div>

                    <h1 className="text-4xl font-extrabold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Manage movies and investment stages
                    </p>

                </div>

                <button
                    onClick={() => navigate('/')}
                    className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold transition hover:bg-zinc-700"
                >
                    Back Home
                </button>

            </div>

            {/* SEARCH BAR */}

            <div className="mb-8">

                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none transition focus:border-red-500"
                />

            </div>

            {/* MOVIES */}

            <div className="space-y-8">

                {filteredMovies?.length > 0 ? (

                    filteredMovies.map((movie) => (

                        <div
                            key={movie.id}
                            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
                        >

                            {/* MOVIE HEADER */}

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                    <h2 className="text-3xl font-bold">
                                        {movie.title}
                                    </h2>

                                    <p className="mt-2 text-zinc-400">
                                        {movie.description}
                                    </p>

                                </div>

                                {/* MOVIE ACTIONS */}

                                <div className="flex gap-3">

                                    <button
                                        onClick={() =>
                                            handleMovieStatus(
                                                movie.id,
                                                'APPROVED'
                                            )
                                        }
                                        className="rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleMovieStatus(
                                                movie.id,
                                                'REJECTED'
                                            )
                                        }
                                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
                                    >
                                        Reject
                                    </button>

                                </div>

                            </div>

                            {/* STAGES */}

                            <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800">

                                <table className="min-w-full text-left text-sm">

                                    <thead className="bg-zinc-800 text-zinc-200">

                                        <tr>

                                            <th className="px-5 py-4">
                                                Stage
                                            </th>

                                            <th className="px-5 py-4">
                                                Amount
                                            </th>

                                            <th className="px-5 py-4">
                                                Collected
                                            </th>

                                            <th className="px-5 py-4">
                                                Status
                                            </th>

                                            <th className="px-5 py-4">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {movie.stages?.map((stage) => (

                                            <tr
                                                key={stage.id}
                                                className="border-t border-zinc-800"
                                            >

                                                <td className="px-5 py-4">
                                                    {stage.stageName}
                                                </td>

                                                <td className="px-5 py-4">
                                                    $
                                                    {stage.stageAmount}
                                                </td>

                                                <td className="px-5 py-4">
                                                    $
                                                    {stage.collectedAmount}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold
                                                        ${stage.status === 'COMPLETED'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : stage.status === 'ACTIVE'
                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}
                                                    >
                                                        {stage.status}
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleStageStatus(
                                                                    stage.id,
                                                                    'ACTIVE'
                                                                )
                                                            }
                                                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold transition hover:bg-blue-700"
                                                        >
                                                            Activate
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">

                        No movies found.

                    </div>

                )}

            </div>

        </div>
    );
};

export default AdminDashboard;