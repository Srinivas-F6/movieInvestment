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
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState('');
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

   const filteredMovies = investments?.filter((investment) =>
    investment.movie?.title
      .toLowerCase()
      .includes(search.toLowerCase())
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

      formData.append("image", image);

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
      setImage(null);

      navigate('/');

    } catch (err) {

      console.error(
        'Failed to create movie',
        err
      );

      alert('Failed to create movie.');
    }
  };

  // ================ HandleImageChange =================
  const handleImageChange = (e) => {

    const file = e.target.files[0];
    console.log(file.size);

    if (!file) return;

    // FILE SIZE CHECK (5MB)
    if (file.size > 5 * 1024 * 1024) {

      alert("Image size must be less than 5MB");

      return;
    }

    // FILE TYPE CHECK
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!validTypes.includes(file.type)) {

      alert("Only JPG, PNG, WEBP images allowed");

      return;
    }

    setImage(file);
  };

  return (

    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-3 border-b border-zinc-800 pb-6 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Welcome back! Manage your movies and investments.
          </p>
        </div>

        <div className="inline-flex w-fit rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-400">
          {role}
        </div>

      </div>

      {/* ================= PRODUCER SECTION ================= */}

      {role === 'PRODUCER' && (
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur">

          <div className="mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-white">
              Create Movie Campaign
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Submit a new movie project for approval and funding.
            </p>
          </div>

          <form
            onSubmit={handleCreateMovie}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Movie Title
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter movie title"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* POSTER */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Movie Poster
                </label>

                <input
                  type="file"
                  required
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  JPG, PNG, WEBP • Max 5 MB • Recommended 1100×590
                </p>
              </div>

              {/* SLOT PRICE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Slot Price
                </label>

                <input
                  type="number"
                  required
                  value={slotPrice}
                  onChange={(e) => setSlotPrice(e.target.value)}
                  placeholder="₹ per slot"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* CAST */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Cast
                </label>

                <input
                  type="text"
                  value={cast}
                  required
                  onChange={(e) => setCast(e.target.value)}
                  placeholder="Actor1, Actor2"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* CREW */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Crew
                </label>

                <input
                  type="text"
                  required
                  value={crew}
                  onChange={(e) => setCrew(e.target.value)}
                  placeholder="Director, Music Director"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* TARGET FUNDING */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Target Funding (₹)
                </label>

                <input
                  type="number"
                  required
                  value={targetFunding}
                  onChange={(e) => setTargetFunding(e.target.value)}
                  placeholder="Funding goal"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Movie Description
              </label>

              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your movie project..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating
                  ? 'Creating...'
                  : 'Submit Movie Project'}
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ================= Producer Movies =================== */}
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

                      <h3 className="text-2xl font-bold text-white">
                        {movie.title}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">

                        <div className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                          Total Budget: ₹{movie.targetFunding}
                        </div>

                        <div className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                          Raised ₹{movie.currentFunding}
                        </div>

                        <div
                          className={`rounded-full px-2 py-1 text-sm 
                    ${movie.status === "APPROVED"
                              ? "bg-green-500/10 text-green-400"
                              : movie.status === "REJECTED"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                        >
                          {movie.status}
                        </div>

                      </div>

                    </div>

                    {/* Right Side */}
                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() => {

                          if (movie.status === "APPROVED") {

                            navigate(`/movies/${movie.id}/create-stage`);

                          } else if (movie.status === "PENDING") {

                            alert(
                              "Movie is still pending admin approval."
                            );

                          } else if (movie.status === "REJECTED") {

                            alert(
                              "Movie was rejected by admin."
                            );

                          } else {

                            alert(
                              `Cannot create stage when movie status is ${movie.status}`
                            );

                          }

                        }}
                        className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
                      >
                        Create Stage
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/movie/stageDetails/${movie.id}`)
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Stage Details
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/movie/investorDetails/${movie.id}`)
                        }
                        className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                      >
                        Investors
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>
      )}



      {/* ================= INVESTMENTS SECTION ================= */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg backdrop-blur">

        {/* Header */}
        <div className="mb-6 border-b border-zinc-800 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Your Investments
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Track all your movie investments and funding contributions.
              </p>
            </div>

            {/* Search */}
            <div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movie..."
                className="w-56 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

          </div>
        </div>  

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="py-8 text-center text-red-500">
            Failed to load investments.
          </div>
        )}

        {/* Empty */}
        {investments?.length === 0 && (
          <div className="py-8 text-center text-zinc-500">
            You haven't made any investments yet.
          </div>
        )}

        {/* Investment List */}
        {filteredMovies?.length > 0 && (
          <div className="space-y-4">

            {filteredMovies.map((investment) => (

              <div
                key={investment.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition hover:border-red-500/40"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Left Side */}
                  <div>
                    <h3 className="mt-1 text-2xl font-bold text-white">
                      {investment.movie?.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">

                      <div className="rounded-full bg-purple-500/10 px-2 py-1 text-sm font-medium text-purple-400">
                        Stage: {investment.stage?.stageName}
                      </div>

                      <div className="rounded-full bg-red-500/10 px-2 py-1 text-sm font-medium text-red-400">
                        Amount: ₹{investment.amount}
                      </div>

                      <div className="rounded-full bg-blue-500/10 px-2 py-1 text-sm font-medium text-blue-400">
                        Slots: {investment.slotsToBuy}
                      </div>

                    </div>

                  </div>

                  {/* Right Side */}
                  <div className="lg:text-right">

                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Invested On
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-300">
                      {new Date(investment.investedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;