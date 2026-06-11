import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    BanknotesIcon,
    CurrencyRupeeIcon,
    PlusCircleIcon,
    RectangleStackIcon,
    UsersIcon,
    CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import {
    useGetMoviesByProducerQuery,
    useGetInvestorDashboardQuery,
} from '../store/apiSlice';

export function ProducerDashboard() {
    const navigate = useNavigate();

    const { token, role, userId } = useSelector((state) => state.auth);

    const { data: producerMovies, isLoading: moviesLoading, isError: moviesError } = useGetMoviesByProducerQuery(
        userId,
        {
            skip: role !== 'PRODUCER',
        }
    );

    console.log("Producer Movies:", producerMovies);

    const totalProfit = producerMovies?.reduce(
        (sum, movie) => sum + Number(movie.profit || 0),
        0
    ) ?? 0;

    const totalLoss = producerMovies?.reduce(
        (sum, movie) => sum + Number(movie.loss || 0),
        0
    ) ?? 0;

    const { data, isLoading, isError } = useGetInvestorDashboardQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            {/* ================= Producer Movies =================== */}
            <div className="space-y-8 p-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

                    <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">
                        <h3 className="text-sm text-zinc-400">
                            Total Invested
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-white">
                            ₹{data?.totalInvested ?? 0}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">
                        <h3 className="text-sm text-zinc-400">
                            Total Received
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-green-500">
                            ₹{data?.totalReceived ?? 0}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-400">
                                    Total Profit
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-green-400">
                                    ₹{totalProfit}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-red-400">
                                    Total Loss
                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-red-400">
                                    ₹{totalLoss}
                                </h3>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">

                    <h2 className="mb-6 text-2xl font-bold text-white">
                        My Investments
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead>
                                <tr className="border-b border-zinc-700 text-zinc-400">
                                    <th className="pb-4">Movie</th>
                                    <th className="pb-4">Invested</th>
                                    <th className="pb-4">Interest</th>
                                    <th className="pb-4">Profit</th>
                                    <th className="pb-4">Loss</th>
                                    <th className="pb-4">Received</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data?.movies?.map((movie) => (
                                    <tr
                                        key={movie.movieId}
                                        className="border-b border-zinc-800 text-white"
                                    >
                                        <td className="py-4 font-medium">
                                            {movie.movieTitle}
                                        </td>   
                                        <td className="py-4">
                                            ₹{movie.totalInvested}
                                        </td>
                                        <td className="py-4">
                                            ₹{movie.interestEarned}
                                        </td>
                                        <td className="py-4 text-green-500">
                                            ₹{movie.profitEarned}
                                        </td>
                                        <td className="py-4 text-red-500">
                                            ₹{movie.lossAmount}
                                        </td>
                                        <td className="py-4">
                                            ₹{movie.totalReceived}
                                        </td>
                                        <td className="py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold
                                                ${movie.status === "PROFIT"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : movie.status === "LOSS"
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                            >
                                                {movie.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {role === "PRODUCER" && (
                <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur">

                    {/* Header */}
                    <div className="mb-6 border-b border-zinc-800 pb-4">
                        <h2 className="text-2xl font-bold text-white">
                            Your Movies
                        </h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Manage your movie campaigns and funding stages.
                        </p>
                    </div>

                    <div className="mb-8 grid gap-4 md:grid-cols-4">

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                            <p className="text-sm text-zinc-400">Movies</p>
                            <h3 className="mt-2 text-3xl font-bold text-white">
                                {producerMovies?.length || 0}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                            <p className="text-sm text-green-400">Total Profit</p>
                            <h3 className="mt-2 text-3xl font-bold text-green-400">
                                ₹{totalProfit}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                            <p className="text-sm text-red-400">Total Loss</p>
                            <h3 className="mt-2 text-3xl font-bold text-red-400">
                                ₹{totalLoss}
                            </h3>
                        </div>

                    </div>

                    {moviesLoading && (
                        <div className="py-8 text-center text-zinc-400">
                            Loading movies...
                        </div>
                    )}

                    {moviesError && (
                        <div className="py-8 text-center text-red-500">
                            Failed to load movies.
                        </div>
                    )}

                    {producerMovies?.length === 0 && (
                        <div className="py-8 text-center text-zinc-500">
                            No movies created yet.
                        </div>
                    )}

                    {producerMovies?.length > 0 && (
                        <div className="space-y-4">
                            {producerMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 transition hover:border-red-500/40"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                        {/* Left Side */}
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">



                                                <h2 className="text-2xl font-bold text-white">
                                                    {movie.title}
                                                </h2>

                                                <span
                                                    className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-wide
        ${movie.status === "APPROVED"
                                                            ? "bg-green-500/15 text-green-400"
                                                            : movie.status === "REJECTED"
                                                                ? "bg-red-500/15 text-red-400"
                                                                : "bg-yellow-500/15 text-yellow-400"
                                                        }`}
                                                >
                                                    {movie.status}
                                                </span>

                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">

                                                <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                                                    <BanknotesIcon className="h-4 w-4" />
                                                    Budget: ₹{movie.targetFunding}
                                                </div>

                                                <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                                                    <CurrencyRupeeIcon className="h-4 w-4" />
                                                    Raised: ₹{movie.currentFunding}
                                                </div>

                                                <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">

                                                    Profit: ₹{movie.profit}
                                                </div>

                                                <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">

                                                    Loss: ₹{movie.loss}
                                                </div>

                                            </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="grid grid-cols-2 gap-2">

                                            <button
                                                onClick={() => {
                                                    if (movie.status === "APPROVED") {
                                                        navigate(`/movies/${movie.id}/create-stage`);
                                                    } else if (movie.status === "PENDING") {
                                                        alert("Movie is still pending admin approval.");
                                                    } else if (movie.status === "REJECTED") {
                                                        alert("Movie was rejected by admin.");
                                                    } else {
                                                        alert(`Cannot create stage when movie status is ${movie.status}`);
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
                                            >
                                                <PlusCircleIcon className="h-4 w-4" /> Create Stage
                                            </button>

                                            <button
                                                onClick={() => navigate(`/movie/stageDetails/${movie.id}`)}
                                                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                            >
                                                <RectangleStackIcon className="h-4 w-4" /> Stage Details
                                            </button>

                                            <button
                                                onClick={() => navigate(`/movie/investorDetails/${movie.id}`)}
                                                className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                                            >
                                                <UsersIcon className="h-4 w-4" /> Investors
                                            </button>

                                            {movie.status === "COMPLETED" && (
                                                <button
                                                    onClick={() => navigate(`/movie/${movie.id}/settlement`)}
                                                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                                >
                                                    <CheckBadgeIcon className="h-4 w-4" /> Settle Movie
                                                </button>
                                            )}

                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </>
    );
}