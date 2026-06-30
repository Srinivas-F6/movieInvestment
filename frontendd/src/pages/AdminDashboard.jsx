import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
    useGetMoviesQuery,
    useUpdateMovieStatusMutation,
    useUpdateStageStatusMutation,
    useHideMovieMutation,
    useUnhideMovieMutation,
    useUpdateUserRoleMutation,
    useDeleteMovieMutation,
    useDeleteStageMutation,
} from '../store/apiSlice';

import {
    ShieldCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeSlashIcon,
    EyeIcon,
    FilmIcon,
    PlayCircleIcon,
    PauseCircleIcon,
    TrashIcon,
    UserCircleIcon
} from "@heroicons/react/24/solid";

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
            else if (status === 'PENDING') {
                alert('Movie marked as pending');
            }
            else if (status === 'COMPLETED') {
                alert('Movie marked as completed');
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

    // ================= DELETE MOVIE =================

    const [deleteMovie] = useDeleteMovieMutation();

    const handleDelete = async (movieId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this movie? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteMovie(movieId).unwrap();

            alert("Movie deleted successfully");

        } catch (error) {

            alert("Failed to delete movie");
        }
    };


    //  ================= DELETE STAGE =================

    const [deleteStage] = useDeleteStageMutation();

    const handleDeleteStage = async (stageId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this stage?"
        );

        if (!confirmed) return;

        try {

            await deleteStage(stageId).unwrap();

            alert("Stage deleted successfully");

        } catch (error) {

            alert(
                error?.data?.message ||
                "Failed to delete stage"
            );
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

        <div className="min-h-screen bg-black px-4 py-6 text-white">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-extrabold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        Manage movies and investment stages
                    </p>

                </div>

                <button
                    onClick={() => navigate('/')}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:border-red-500 hover:text-red-400"
                >
                    ← Back
                </button>

            </div>

            {/* SEARCH BAR */}
            <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

                <h2 className="mb-3 text-lg font-bold">
                    Update User Role
                </h2>

                <div className="flex flex-col gap-3 lg:flex-row">

                    {/* INPUT */}
                    <input
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-xl border border-zinc-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-500"
                    />

                    {/* SELECT */}
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="rounded-xl border border-zinc-700 bg-black px-3 py-2 text-sm text-white outline-none"
                    >
                        <option value="USER">USER</option>
                        <option value="PRODUCER">PRODUCER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    {/* BUTTON */}
                    <button
                        onClick={handleRoleUpdate}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        <ShieldCheckIcon className="h-4 w-4" />
                        Update Role
                    </button>

                </div>

            </div>

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-red-500"
                />

            </div>

            {/* MOVIES */}

            <div className="space-y-5">

                {filteredMovies?.length > 0 ? (

                    filteredMovies.map((movie) => (

                        <div
                            key={movie.id}
                            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl"
                        >

                            {/* MOVIE HEADER */}

                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                {/* LEFT SIDE */}
                                <div className="flex-1">

                                    {/* TITLE + STATUS */}
                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="text-2xl font-bold text-white">
                                            {movie.title}
                                        </h2>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide
                                                      ${movie.status === 'APPROVED'
                                                    ? 'bg-green-500/15 text-green-400'
                                                    : movie.status === 'REJECTED'
                                                        ? 'bg-red-500/15 text-red-400'
                                                        : 'bg-yellow-500/15 text-yellow-400'
                                                }`}
                                        >
                                            {movie.status}
                                        </span>

                                    </div>

                                    {/* PRIMARY ACTIONS */}
                                    <div className="mt-4 flex flex-wrap gap-2">

                                        <button
                                            onClick={() => navigate(`/movie/${movie.id}`)}
                                            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-red-600/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                                        >
                                            <FilmIcon className="h-4 w-4" />
                                            Movie Details
                                        </button>

                                        <button
                                            onClick={() => handleDelete(movie.id)}
                                            className="flex items-center gap-1.5 rounded-lg border border-red-800 bg-zinc-900 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/40"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Delete Movie
                                        </button>

                                    </div>

                                </div>

                                {/* RIGHT SIDE ACTIONS */}
                                <div className="flex flex-wrap gap-2 lg:justify-end">

                                    <button
                                        disabled={movie.status === 'APPROVED' || movie.status === 'COMPLETED'}
                                        onClick={() => handleMovieStatus(movie.id, 'APPROVED')}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition
    ${movie.status === 'APPROVED' || movie.status === 'COMPLETED'
                                                ? 'cursor-not-allowed bg-green-700 text-white'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                    >
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Approve
                                    </button>

                                    <button
                                        disabled={movie.status === 'REJECTED' || movie.status === 'COMPLETED'}
                                        onClick={() => handleMovieStatus(movie.id, 'REJECTED')}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition
    ${movie.status === 'REJECTED' || movie.status === 'COMPLETED'
                                                ? 'cursor-not-allowed bg-red-700 text-white'
                                                : 'bg-red-600 hover:bg-red-700 text-white'
                                            }`}
                                    >
                                        <XCircleIcon className="h-4 w-4" />
                                        Reject
                                    </button>

                                    <button
                                        disabled={movie.status === 'PENDING' || movie.status === 'COMPLETED'}
                                        onClick={() => handleMovieStatus(movie.id, 'PENDING')}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition
    ${movie.status === 'PENDING' || movie.status === 'COMPLETED'
                                                ? 'cursor-not-allowed bg-yellow-700 text-white'
                                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                            }`}
                                    >
                                        <ClockIcon className="h-4 w-4" />
                                        Pending
                                    </button>

                                    <button
                                        onClick={() => handleHideToggle(movie)}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition
    ${movie.hidden
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-cyan-700 hover:bg-cyan-600 text-white'
                                            }`}
                                    >
                                        {movie.hidden ? (
                                            <>
                                                <EyeIcon className="h-4 w-4" />
                                                Unhide
                                            </>
                                        ) : (
                                            <>
                                                <EyeSlashIcon className="h-4 w-4" />
                                                Hide
                                            </>
                                        )}
                                    </button>

                                    <button
                                        disabled={movie.status === 'COMPLETED'}
                                        onClick={() => handleMovieStatus(movie.id, 'COMPLETED')}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition
    ${movie.status === 'COMPLETED'
                                                ? 'cursor-not-allowed bg-purple-700 text-white'
                                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                                            }`}
                                    >
                                        <FilmIcon className="h-4 w-4" />
                                        Completed
                                    </button>

                                </div>

                            </div>

                            {/* STAGES */}

                            <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800">

                                <table className="min-w-full text-left text-xs">

                                    {/* HEADER */}
                                    <thead className="bg-zinc-800/60 text-zinc-300">

                                        <tr>

                                            <th className="px-4 py-3 font-semibold">Stage</th>
                                            <th className="px-4 py-3 font-semibold">Amount</th>
                                            <th className="px-4 py-3 font-semibold">Collected</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">Actions</th>

                                        </tr>

                                    </thead>

                                    {/* BODY */}
                                    <tbody>

                                        {movie.stages?.map((stage) => (

                                            <tr
                                                key={stage.id}
                                                className="border-t border-zinc-800/60 hover:bg-zinc-800/20 transition"
                                            >

                                                <td className="px-4 py-3 font-medium text-white">
                                                    {stage.stageName}
                                                </td>

                                                <td className="px-4 py-3 text-zinc-300">
                                                    ₹{stage.stageAmount}
                                                </td>

                                                <td className="px-4 py-3 text-zinc-300">
                                                    ₹{stage.collectedAmount}
                                                </td>

                                                <td className="px-4 py-3">

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase
                                                                  ${stage.status === 'COMPLETED'
                                                                ? 'bg-green-500/15 text-green-400'
                                                                : stage.status === 'ACTIVE'
                                                                    ? 'bg-blue-500/15 text-blue-400'
                                                                    : 'bg-yellow-500/15 text-yellow-400'
                                                            }`}
                                                    >
                                                        {stage.status}
                                                    </span>

                                                </td>

                                                <td className="px-4 py-3">

                                                    <div className="flex flex-wrap gap-2">

                                                        <button
                                                            disabled={
                                                                stage.status === 'ACTIVE' ||
                                                                stage.status === 'COMPLETED'
                                                            }
                                                            onClick={() =>
                                                                handleStageStatus(stage.id, 'ACTIVE')
                                                            }
                                                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition
        ${stage.status === 'ACTIVE' ||
                                                                    stage.status === 'COMPLETED'
                                                                    ? 'cursor-not-allowed bg-blue-700 text-white'
                                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                }`}
                                                        >
                                                            <PlayCircleIcon className="h-3.5 w-3.5" />
                                                            Activate
                                                        </button>

                                                        <button
                                                            disabled={
                                                                stage.status === 'HOLD' ||
                                                                stage.status === 'COMPLETED'
                                                            }
                                                            onClick={() =>
                                                                handleStageStatus(stage.id, 'HOLD')
                                                            }
                                                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition
        ${stage.status === 'HOLD' ||
                                                                    stage.status === 'COMPLETED'
                                                                    ? 'cursor-not-allowed bg-red-700 text-white'
                                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                                                }`}
                                                        >
                                                            <PauseCircleIcon className="h-3.5 w-3.5" />
                                                            Hold
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteStage(stage.id)}
                                                            className="flex items-center gap-1 rounded-lg border border-red-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:bg-red-950/40"
                                                        >
                                                            <TrashIcon className="h-3.5 w-3.5" />
                                                            Delete
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