import { useGetInvestorDashboardQuery } from "../store/apiSlice";
export function UserDashboard() {
    const {
        data,
        isLoading,
        isError,
    } = useGetInvestorDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
});
    console.log(data);

    if (isLoading) {
        return (
            <div className="p-6 text-white">
                Loading dashboard...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-red-500">
                Failed to load dashboard
            </div>
        );
    }

    return (
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

                <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">
                    <h3 className="text-sm text-zinc-400">
                        Total Profit
                    </h3>

                    <p className="mt-2 text-3xl font-bold text-green-500">
                        ₹{data?.totalProfit ?? 0}
                    </p>
                </div>

                <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">
                    <h3 className="text-sm text-zinc-400">
                        Total Loss
                    </h3>

                    <p className="mt-2 text-3xl font-bold text-red-500">
                        ₹{data?.totalLoss ?? 0}
                    </p>
                </div>

            </div>

            {/* Movie Wise Investments */}

            <div className="rounded-2xl bg-zinc-900 p-6 shadow-lg">

                <h2 className="mb-6 text-2xl font-bold text-white">
                    My Investments
                </h2>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead>

                            <tr className="border-b border-zinc-700 text-zinc-400">

                                <th className="pb-4">
                                    Movie
                                </th>

                                <th className="pb-4">
                                    Invested
                                </th>

                                <th className="pb-4">
                                    Interest
                                </th>

                                <th className="pb-4">
                                    Profit
                                </th>

                                <th className="pb-4">
                                    Loss
                                </th>

                                <th className="pb-4">
                                    Received
                                </th>

                                <th className="pb-4">
                                    Status
                                </th>

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
                                                ${
                                                    movie.status === "PROFIT"
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
    );
}