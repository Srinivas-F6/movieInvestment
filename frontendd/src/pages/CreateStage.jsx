import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateStageMutation } from '../store/apiSlice';
import {useSelector} from 'react-redux';

const CreateStage = () => {

    const { movieId } = useParams();
    const navigate = useNavigate();

    const [stageName, setStageName] = useState('');
    const [amount, setAmount] = useState('');

    const [createStage, { isLoading }] = useCreateStageMutation();

    const { token, role } = useSelector((state) => state.auth);

    if (!token || role !== 'PRODUCER') {
        return <Navigate to="/login" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createStage({
                movieId: Number(movieId),
                stageName,
                amount: Number(amount),
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
        <div className="flex min-h-[80vh] items-center justify-center px-4">

            <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

                <h1 className="mb-6 text-center text-3xl font-bold text-white">
                    Create Investment Stage
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Stage Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Stage Name
                        </label>

                        <select
                            value={stageName}
                            onChange={(e) => setStageName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                        >
                            <option value="">Select Stage</option>
                            <option value="PRE_PRODUCTION">Pre Production</option>
                            <option value="PRODUCTION">Production</option>
                            <option value="POST_PRODUCTION">Post Production</option>
                            <option value="MARKETING_DISTRIBUTION">Marketing & Distribution</option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Stage Amount ($)
                        </label>

                        <input
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter stage budget"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
                    >
                        {isLoading ? 'Creating...' : 'Create Stage'}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateStage;