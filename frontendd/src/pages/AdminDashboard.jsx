import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
    useGetMoviesQuery,
    useUpdateMovieStatusMutation,
    useUpdateStageStatusMutation,
    useHideMovieMutation,
    useUnhideMovieMutation,
    useUpdateUserRoleMutation,
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

    const [updateMovieStatus] = useUpdateMovieStatusMutation();
    const [updateStageStatus] = useUpdateStageStatusMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [hideMovie] = useHideMovieMutation();
    const [unhideMovie] = useUnhideMovieMutation();

    // ================= FILTERED MOVIES =================

    const filteredMovies = movies?.filter((movie) =>
        movie.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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

            if (status === 'APPROVED') {
                alert('Movie approved successfully');
            }

            else if (status === 'REJECTED') {
                alert('Movie rejected successfully');
            }

            else if (status === 'HIDE') {
                alert('Movie hidden successfully');
            }

            else if (status === 'UNHIDE') {
                alert('Movie unhidden successfully');
            }

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

    // ================= HIDE / UNHIDE =================
    const handleHideToggle = async (movie) => {

        try {

            if (movie.hidden) {

                await unhideMovie(movie.id).unwrap();

                alert('Movie unhidden successfully');

            } else {

                await hideMovie(movie.id).unwrap();

                alert('Movie hidden successfully');
            }

        } catch (err) {

            console.error(err);

            alert('Failed to update movie visibility');
        }
    };

    // ================= ROLE UPDATE =================

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER');

    const handleRoleUpdate = async () => {

        try {

            await updateUserRole({
                email,
                role,
            }).unwrap();

            alert('Role updated successfully');

            setEmail('');
            setRole('USER');

        } catch (err) {

            console.error(err);

            alert('Failed to update role');
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
            <div className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

                <h2 className="mb-5 text-2xl font-bold">
                    Update User Role
                </h2>

                <div className="flex flex-col gap-4 lg:flex-row">

                    <input
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="flex-1 rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none focus:border-red-500"
                    />

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                        className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none"
                    >
                        <option value="USER">USER</option>
                        <option value="PRODUCER">PRODUCER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <button
                        onClick={handleRoleUpdate}
                        className="rounded-2xl bg-red-600 px-6 py-4 font-semibold transition hover:bg-red-700"
                    >
                        Update Role
                    </button>

                </div>

            </div>

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

                                    <div className="flex items-center gap-3">

                                        <h2 className="text-3xl font-bold">
                                            {movie.title}
                                        </h2>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide
                                                     ${movie.status === 'APPROVED'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : movie.status === 'REJECTED'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                }`}
                                        >
                                            {movie.status}
                                        </span>

                                    </div>

                                    <p className="mt-2 text-zinc-400">
                                        {movie.description}
                                    </p>
                                    <div className="mt-2">
                                            <button
                                                onClick={() =>
                                                    navigate(`/movie/${movie.id}`)
                                                }
                                                className="flex-1 rounded-xl border border-zinc-700 bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                                            >
                                                Movie Details
                                            </button>

                                        </div>

                                </div>


                                {/* MOVIE ACTIONS */}

                                <div className="flex gap-3">

                                    {/* APPROVE */}

                                    <button
                                        disabled={movie.status === 'APPROVED'}
                                        onClick={() =>
                                            handleMovieStatus(
                                                movie.id,
                                                'APPROVED'
                                            )
                                        }
                                        className={`rounded-xl px-5 py-3 font-semibold transition
                                                ${movie.status === 'APPROVED'
                                                ? 'cursor-not-allowed bg-zinc-600 text-zinc-400'
                                                : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                    >
                                        Approve
                                    </button>

                                    {/* REJECT */}

                                    <button
                                        disabled={movie.status === 'REJECTED'}
                                        onClick={() =>
                                            handleMovieStatus(
                                                movie.id,
                                                'REJECTED'
                                            )
                                        }
                                        className={`rounded-xl px-5 py-3 font-semibold transition
                                                  ${movie.status === 'REJECTED'
                                                ? 'cursor-not-allowed bg-zinc-600 text-zinc-400'
                                                : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        Reject
                                    </button>

                                    {/* PENDING */}

                                    <button
                                        disabled={movie.status === 'PENDING'}
                                        onClick={() =>
                                            handleMovieStatus(
                                                movie.id,
                                                'PENDING'
                                            )
                                        }
                                        className={`rounded-xl px-5 py-3 font-semibold transition
                                                ${movie.status === 'PENDING'
                                                ? 'cursor-not-allowed bg-zinc-600 text-zinc-400'
                                                : 'bg-yellow-600 hover:bg-yellow-700'
                                            }`}
                                    >
                                        Pending
                                    </button>

                                    {/* HIDE / UNHIDE */}

                                    <button
                                        onClick={() => handleHideToggle(movie)}
                                        className={`rounded-xl px-5 py-3 font-semibold transition
                                                 ${movie.hidden
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-zinc-700 hover:bg-zinc-600'
                                            }`}
                                    >
                                        {movie.hidden ? 'Unhide' : 'Hide'}
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

                                                        {/* ACTIVATE */}

                                                        <button
                                                            disabled={
                                                                stage.status === 'ACTIVE' ||
                                                                stage.status === 'COMPLETED'
                                                            }
                                                            onClick={() =>
                                                                handleStageStatus(
                                                                    stage.id,
                                                                    'ACTIVE'
                                                                )
                                                            }
                                                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition
                                                                    ${stage.status === 'ACTIVE' ||
                                                                    stage.status === 'COMPLETED'
                                                                    ? 'cursor-not-allowed bg-zinc-600 text-zinc-400'
                                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                                }`}
                                                        >
                                                            Activate
                                                        </button>

                                                        {/* HOLD */}

                                                        <button
                                                            disabled={
                                                                stage.status === 'HOLD' ||
                                                                stage.status === 'COMPLETED'
                                                            }
                                                            onClick={() =>
                                                                handleStageStatus(
                                                                    stage.id,
                                                                    'HOLD'
                                                                )
                                                            }
                                                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition
                                                                    ${stage.status === 'HOLD' ||
                                                                    stage.status === 'COMPLETED'
                                                                    ? 'cursor-not-allowed bg-zinc-600 text-zinc-400'
                                                                    : 'bg-red-600 hover:bg-red-700'
                                                                }`}
                                                        >
                                                            Hold
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