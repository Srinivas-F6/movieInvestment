import { useGetMoviesQuery, useGetStagesByMovieQuery } from '../store/apiSlice';
import { useNavigate } from 'react-router-dom';



const Home = () => {

  const navigate = useNavigate();

  const {
    data: movies,
    isLoading,
    isError,
  } = useGetMoviesQuery();

  const visibleMovies = movies?.filter((movie) => !movie.hidden);


  // ================= LOADING =================

  if (isLoading) {

    return (

      <div className="flex h-[80vh] items-center justify-center">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

      </div>
    );
  }

  // ================= ERROR =================

  if (isError) {

    return (

      <div className="flex items-center justify-center py-20">

        <h2 className="text-2xl font-semibold text-red-500">
          Failed to load movies.
        </h2>

      </div>
    );
  }

  return (

    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* HERO SECTION */}

      <div className="mb-12 text-center">

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          Discover Movies to Invest In
        </h1>

        <p className="mx-auto max-w-2xl text-zinc-400">
          Support upcoming movie projects and become
          part of the entertainment revolution.
        </p>

      </div>

      {/* MOVIES GRID */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {visibleMovies?.map((movie) => {

          const stage = movie.stages?.[0];

          const currentFunding =
            Number(movie.currentFunding);

          const targetFunding =
            Number(movie.targetFunding);

          const progress =
            targetFunding > 0
              ? (currentFunding / targetFunding) * 100
              : 0;

          return (

            <div
              key={movie.id}
              className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-red-500/50"
            >

              {/* IMAGE */}

              <div className="h-64 relative overflow-hidden">
                <img
                  src={
                    movie.imageUrl
                      ? `${import.meta.env.VITE_API_URL}${movie.imageUrl}`
                      : "/icons.svg"
                  }
                  alt={movie.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <span className="absolute bottom-4 left-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {movie.status}
                </span>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <h2 className="mb-3 text-2xl font-bold text-white">
                  {movie.title}
                </h2>
                <h2 className="mb-3 text-1xl  text-white">
                  {movie.slotPrice ? `₹${movie.slotPrice} per slot` : 'No slot price available'}
                </h2>

                {/* BUTTON */}

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/movie/${movie.id}`)
                    }
                    className="flex-1 rounded-xl border border-zinc-700 bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                  >
                    Movie Details
                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Home;