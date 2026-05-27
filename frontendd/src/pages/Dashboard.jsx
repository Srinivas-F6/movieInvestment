import { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  useGetInvestmentsForUserQuery,
  useCreateMovieMutation,
  useGetMoviesByProducerQuery,
} from '../store/apiSlice';

import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

  const navigate = useNavigate();

  const { token, userId, role } = useSelector(
    (state) => state.auth
  );

  const { data: producerMovies, isLoading: moviesLoading, isError: moviesError, } = useGetMoviesByProducerQuery(
    userId,
    {
      skip: role !== 'PRODUCER',
    }
  );


  // ================= FORM STATE =================

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetFunding, setTargetFunding] = useState('');
  const [slotPrice, setSlotPrice] = useState('');
  const [cast, setCast] = useState('');
  const [crew, setCrew] = useState('');
  const [images, setImages] = useState([]);

  // ================= API =================

  const [
    createMovie,
    { isLoading: isCreating },
  ] = useCreateMovieMutation();

  const {
    data: investments,
    isLoading,
    isError,
  } = useGetInvestmentsForUserQuery(
    userId,
    {
      skip: !userId,
    }
  );


  // ================= AUTH CHECK =================

  if (!token) {
    return <Navigate to="/login" />;
  }

  // ================= CREATE MOVIE =================

  const handleCreateMovie = async (e) => {

    e.preventDefault();

    try {

      const movieData = {

        title,

        description,

        targetFunding: parseFloat(targetFunding),

        currentFunding: 0,

        slotPrice: parseFloat(slotPrice),


        cast: cast
          .split(',')
          .map(item => item.trim()),

        crew: crew
          .split(',')
          .map(item => item.trim()),

        status: 'PENDING',
      };

      const formData = new FormData();

      formData.append(
        'movie',
        new Blob(
          [JSON.stringify(movieData)],
          { type: 'application/json' }
        )
      );

      images.forEach((image) => {
        formData.append('images', image);
      });

      await createMovie({

        producerId: userId,

        movieData: formData,

      }).unwrap();

      alert('Movie created successfully!');

      setTitle('');
      setDescription('');
      setTargetFunding('');
      setSlotPrice('');
      setCast('');
      setCrew('');
      setImages([]);

    } catch (err) {

      console.error(
        'Failed to create movie',
        err
      );

      alert('Failed to create movie.');
    }
  };

  return (

    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="mb-2 text-4xl font-extrabold text-white">
          Dashboard
        </h1>

        <p className="text-zinc-400">
          Welcome back!
        </p>

        <div className="mt-3 inline-flex rounded-full bg-red-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-red-400">
          {role}
        </div>

      </div>

      {/* ================= PRODUCER SECTION ================= */}

      {role === 'PRODUCER' && (

        <div className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

          <h2 className="mb-6 text-3xl font-bold text-white">
            Create a New Movie Campaign
          </h2>

          <form
            onSubmit={handleCreateMovie}
            className="space-y-5"
          >

            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Movie Title
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter movie title"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                />

              </div>

              {/* MOVIE IMAGES */}

              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Movie Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setImages(Array.from(e.target.files))
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                />

              </div>

              {/* SLOT PRICE  */}
              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Slot Price
                </label>

                <input
                  type="number"
                  required
                  value={slotPrice}
                  onChange={(e) =>
                    setSlotPrice(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                />

              </div>

              {/* CAST */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Cast (comma separated)
                </label>

                <input
                  type="text"
                  value={cast}
                  onChange={(e) =>
                    setCast(e.target.value)
                  }
                  placeholder="Actor1, Actor2"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                />

              </div>
              {/* CREW */}
              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Crew (comma separated)
                </label>

                <input
                  type="text"
                  value={crew}
                  onChange={(e) =>
                    setCrew(e.target.value)
                  }
                  placeholder="Director, Music Director"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                />

              </div>

              {/* TARGET FUNDING */}

              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Target Funding ($)
                </label>

                <input
                  type="number"
                  required
                  value={targetFunding}
                  onChange={(e) =>
                    setTargetFunding(
                      e.target.value
                    )
                  }
                  placeholder="Enter funding amount"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                />

              </div>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Movie Description
              </label>

              <textarea
                rows="5"
                required
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your movie project..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={isCreating}
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isCreating
                ? 'Creating...'
                : 'Submit Movie Project'}

            </button>

          </form>

        </div>
      )}

      {/* ================= Producer Movies =================== */}
      {role === 'PRODUCER' && (
        <div className="mt-10 mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

          <h2 className="mb-6 text-3xl font-bold text-white">
            Your Movies
          </h2>

          {moviesLoading && (
            <p className="text-zinc-400">
              Loading movies...
            </p>
          )}

          {moviesError && (
            <p className="text-red-500">
              Failed to load movies.
            </p>
          )}

          {producerMovies &&
            producerMovies.length === 0 && (

              <p className="text-zinc-400">
                No movies created yet.
              </p>
            )}

          {producerMovies &&
            producerMovies.length > 0 && (

              <div className="space-y-4">

                {producerMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                  >

                    <h3 className="text-2xl font-bold text-white">
                      {movie.title}
                    </h3>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-3">
                        {/* stats */}
                        <div className="rounded-lg bg-red-500/10 px-4 py-2 text-red-400">
                          Target: $
                          {movie.targetFunding}
                        </div>

                        <div className="rounded-lg bg-blue-500/10 px-4 py-2 text-blue-400">
                          Raised: $
                          {movie.currentFunding}
                        </div>
                        <div className="rounded-lg bg-yellow-500/10 px-4 py-2 text-yellow-400">
                          Status:
                          {movie.status}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">

                        <button
                          onClick={() =>
                            navigate(`/movie/stageDetails/${movie.id}`)
                          }
                          className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                        >
                          stage details
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/movies/${movie.id}/create-stage`)
                          }
                          className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                        >
                          + Create Stage
                        </button>

                      </div>
                    </div>

                  </div>


                ))}

              </div>
            )}

        </div>)}



      {/* ================= INVESTMENTS SECTION ================= */}

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">

        <h2 className="mb-6 text-3xl font-bold text-white">
          Your Investments
        </h2>

        {/* LOADING */}

        {isLoading && (

          <div className="flex justify-center py-10">

            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

          </div>
        )}

        {/* ERROR */}

        {isError && (

          <p className="font-medium text-red-500">
            Failed to load investments.
          </p>
        )}

        {/* EMPTY */}

        {investments &&
          investments.length === 0 && (

            <p className="text-zinc-400">
              You haven't made any investments
              yet.
            </p>
          )}

        {/* INVESTMENTS LIST */}

        {investments &&
          investments.length > 0 && (

            <div className="space-y-4">

              {investments &&
                investments.length > 0 && (

                  <div className="space-y-4">

                    {investments.map((investment) => (

                      <div
                        key={investment.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-red-500/40"
                      >

                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                          {/* LEFT SIDE */}

                          <div className="space-y-3">

                            <div>

                              <p className="text-sm text-zinc-500">
                                Movie
                              </p>

                              <h3 className="text-2xl font-bold text-white">
                                {investment.movie?.title}
                              </h3>

                            </div>

                            <div className="flex flex-wrap gap-3">

                              <div className="rounded-xl bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-400">

                                Stage:
                                {" "}
                                {investment.stage?.stageName}

                              </div>

                              <div className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">

                                Invested:
                                {" "}
                                ${investment.amount}

                              </div>

                              <div className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">

                                Slots:
                                {" "}
                                {investment.slotsToBuy}

                              </div>

                            </div>

                          </div>

                          {/* RIGHT SIDE */}

                          <div className="text-right">

                            <p className="text-sm text-zinc-500">
                              Invested Date
                            </p>

                            <p className="mt-1 text-sm font-medium text-zinc-300">

                              {new Date(
                                investment.investedAt
                              ).toLocaleDateString()}

                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>
                )}

            </div>
          )}

      </div>

    </div>
  );
};

export default Dashboard;