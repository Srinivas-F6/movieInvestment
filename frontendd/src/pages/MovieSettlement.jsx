import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useSettleMovieMutation} from "../store/apiSlice";

export function MovieSettlement() {

    const { movieId } = useParams();

    const navigate = useNavigate();

    const [amount, setAmount] = useState("");

    const [
        settleMovie,
        {
            isLoading,
        },
    ] = useSettleMovieMutation();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!amount || Number(amount) <= 0) {

            alert("Please enter a valid amount");

            return;
        }

        try {

            await settleMovie({
                movieId,
                amount: Number(amount),
            }).unwrap();

            alert("Movie settled successfully");

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            alert(
                error?.data?.message ||
                "Settlement failed"
            );
        }
    };

    return (

        <div className="min-h-screen bg-zinc-950 px-4 py-10">

            <div className="mx-auto max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

                <h1 className="mb-2 text-3xl font-bold text-white">
                    Movie Settlement
                </h1>

                <p className="mb-8 text-zinc-400">
                    Enter the final collection amount
                    for this movie.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Collected Amount
                        </label>

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) =>
                                setAmount(
                                    e.target.value
                                )
                            }
                            placeholder="Enter collection amount"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-green-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                        {isLoading
                            ? "Processing..."
                            : "Settle Movie"}
                    </button>

                </form>

            </div>

        </div>
    );
}