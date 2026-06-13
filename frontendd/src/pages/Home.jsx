import { useGetMoviesQuery } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const {
    data: movies,
    isLoading,
    isError,
  } = useGetMoviesQuery();

  const visibleMovie = movies?.filter((movie) => !movie.hidden);
  const visibleMovies = visibleMovie?.reverse();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load movies.
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* HERO SECTION */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Discover Movies to Invest In
        </h1>

        <p className="mx-auto max-w-xl text-sm text-zinc-400">
          Support upcoming movie projects and become part of the entertainment
          revolution.
        </p>
      </div>

      {/* MOVIES GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleMovies?.map((movie) => (
          <div
            key={movie.id}
            className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-red-500/50"
          >
            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={
                  movie.imageUrl
                    ? `${movie.imageUrl}`
                    : "/icons.svg"
                }
                alt={movie.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <span
                className={`absolute bottom-3 left-3 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white
                  ${
                    movie.status === "APPROVED"
                      ? "bg-green-600"
                      : movie.status === "REJECTED"
                      ? "bg-red-600"
                      : "bg-orange-500"
                  }`}
              >
                {movie.status}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="mb-2 truncate text-lg font-bold text-white">
                {movie.title}
              </h2>

              <p className="mb-4 text-sm text-zinc-300">
                {movie.slotPrice
                  ? `₹${movie.slotPrice} per slot`
                  : "No slot price available"}
              </p>

              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Movie Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;