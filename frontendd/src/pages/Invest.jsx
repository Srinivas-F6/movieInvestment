import { useState } from 'react';

import {
    useParams,
    Navigate,
    useNavigate,
} from 'react-router-dom';

import { useSelector } from 'react-redux';

import {
    useInvestInStageMutation,
    useGetMovieByIdQuery,
} from '../store/apiSlice';

const Invest = () => {

    const { stageId, movieId } = useParams();
    const [slotsToBuy, setSlotsToBuy] = useState('');

    const navigate = useNavigate();

    const { token, userId } = useSelector(
        (state) => state.auth
    );

    const [investInStage, { isLoading }] =
        useInvestInStageMutation();

    const { data: movie, isLoading: movieLoading } = useGetMovieByIdQuery(Number(movieId));
    console.log(movie);

    if (!token) {
        return <Navigate to="/login" />;
    }

    const handleInvest = async (e) => {

        e.preventDefault();

        try {

            await investInStage({
                stageId: Number(stageId),

                movieId: Number(movieId),

                userId,

                slotsToBuy: Number(slotsToBuy),
            }).unwrap();


            alert('Investment successful!');

            navigate('/dashboard');

        } catch (err) {

            console.error(err);
            console.log(err.data);

            alert('Investment failed');
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-6">

            {/* Header */}

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-white">
                        Invest In Stage
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        Purchase investment slots and support this movie project
                    </p>

                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:border-red-500 hover:text-red-400"
                >
                    ← Back
                </button>

            </div>

            {/* Investment Form */}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur">

                <h2 className="mb-5 text-lg font-semibold text-white">
                    Investment Details
                </h2>

                <form
                    onSubmit={handleInvest}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Number of Slots
                        </label>

                        <input
                            type="number"
                            min="1"
                            required
                            value={slotsToBuy}
                            onChange={(e) =>
                                setSlotsToBuy(e.target.value)
                            }
                            placeholder="Enter number of slots"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                        />

                    </div>

                    {/* Investment Preview */}

                    {movie && slotsToBuy && Number(slotsToBuy) > 0 && (

                        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">

                            <h3 className="mb-2 text-sm font-semibold text-green-400">
                                Investment Summary
                            </h3>

                            <div className="space-y-2 text-sm text-zinc-300">

                                <div className="flex justify-between">
                                    <span>Slots</span>
                                    <span>{slotsToBuy}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Price Per Slot</span>
                                    <span>₹{movie.slotPrice}</span>
                                </div>

                                <div className="flex justify-between border-t border-green-500/20 pt-2 font-semibold text-white">
                                    <span>Total Investment</span>
                                    <span>
                                        ₹
                                        {Number(slotsToBuy) *
                                            Number(movie.slotPrice)}
                                    </span>
                                </div>

                            </div>

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading
                            ? "Processing Investment..."
                            : "Confirm Investment"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Invest;