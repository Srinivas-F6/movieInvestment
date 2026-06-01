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

        <div className="relative flex min-h-[80vh] items-center justify-center px-4">
            <div className="absolute left-6 top-6">

                <button
                    onClick={() => navigate(-1)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-2 font-semibold text-white transition hover:border-red-500 hover:bg-red-600/10"
                >
                    ← Back
                </button>

            </div>


            <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

                <h1 className="mb-6 text-center text-3xl font-bold text-white">
                    Invest In Stage
                </h1>

                <form
                    onSubmit={handleInvest}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Number Of Slots
                        </label>

                        <input
                            type="number"
                            required
                            min="1"
                            value={slotsToBuy}
                            onChange={(e) =>
                                setSlotsToBuy(e.target.value)
                            }
                            placeholder="Enter slots"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-red-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >

                        {isLoading
                            ? 'Processing...'
                            : 'Confirm Investment'}

                    </button>

                </form>

            </div>

        </div>
    );
};

export default Invest;