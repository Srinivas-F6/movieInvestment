import { useState } from 'react';
import {
    useParams,
    useNavigate,
    Navigate
} from 'react-router-dom';

import {
    useCreateStageMutation,
    useGetMovieByIdQuery
} from '../store/apiSlice';

import { useSelector } from 'react-redux';

const CreateStage = () => {

    const { movieId } = useParams();
    const navigate = useNavigate();

    const [stageName, setStageName] = useState('');
    const [amount, setAmount] = useState('');

    const [createStage, { isLoading }] =
        useCreateStageMutation();

    const { data: movie } =
        useGetMovieByIdQuery(movieId);

    const { token, role } =
        useSelector((state) => state.auth);

    if (!token || role !== 'PRODUCER') {
        return <Navigate to="/login" />;
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        const stageAmount = Number(amount);
        const slotAmount = Number(movie?.slotPrice);

        if (!slotAmount) {
            alert('Movie slot price not found');
            return;
        }

        if (stageAmount <= slotAmount) {
            alert(
                `Stage amount must be greater than slot price (₹${slotAmount})`
            );
            return;
        }

        if (stageAmount % slotAmount !== 0) {
            alert(
                `Stage amount must be divisible by slot price (₹${slotAmount})`
            );
            return;
        }

        try {

            await createStage({
                movieId: Number(movieId),
                stageName,
                amount: stageAmount,
            }).unwrap();

            setStageName('');
            setAmount('');

            alert('Stage created successfully!');

            navigate('/dashboard');

        } catch (err) {

            console.error(err);

            alert('Failed to create stage');
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-5">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">

                <div>

                    <h1 className="text-xl font-bold text-white">
                        Create Investment Stage
                    </h1>

                    <p className="mt-1 text-xs text-zinc-400">
                        Add a new funding stage for your movie
                    </p>

                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:border-red-500 hover:text-red-400"
                >
                    ← Back
                </button>

            </div>

            {/* Form */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg backdrop-blur">

                <h2 className="mb-4 text-base font-semibold text-white">
                    Stage Information
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Stage Name */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Stage Name
                        </label>

                        <select
                            value={stageName}
                            onChange={(e) =>
                                setStageName(e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-purple-500"
                        >
                            <option value="">
                                Select Stage
                            </option>

                            <option value="PRE_PRODUCTION">
                                🎬 Pre Production
                            </option>

                            <option value="PRODUCTION">
                                🎥 Production
                            </option>

                            <option value="POST_PRODUCTION">
                                ✂️ Post Production
                            </option>

                            <option value="MARKETING_DISTRIBUTION">
                                📢 Marketing & Distribution
                            </option>

                        </select>

                    </div>

                    {/* Amount */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Stage Budget (₹)
                        </label>

                        <input
                            type="number"
                            min="1"
                            required
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="Enter stage amount"
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-purple-500"
                        />

                    </div>

                    {/* Rules */}
                    {movie && (

                        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">

                            <h3 className="mb-2 text-sm font-semibold text-yellow-400">
                                Validation Rules
                            </h3>

                            <ul className="space-y-1 text-xs text-zinc-300">

                                <li>
                                    • Amount must be greater than ₹{movie.slotPrice}
                                </li>

                                <li>
                                    • Amount must be divisible by ₹{movie.slotPrice}
                                </li>

                                <li>
                                    • Investors purchase slots based on this budget
                                </li>

                            </ul>

                        </div>

                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading
                            ? "Creating Stage..."
                            : "Create Stage"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateStage;