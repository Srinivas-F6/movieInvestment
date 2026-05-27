import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import { useSearchMoviesQuery } from '../store/apiSlice';

import { logout } from '../store/authSlice';

const Navbar = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { token, role } = useSelector(
    (state) => state.auth
  );

  const [search, setSearch] = useState('');

  const { data: movies, } = useSearchMoviesQuery(search, { skip: !search, });

  const handleLogout = () => {

    dispatch(logout());

    navigate('/login');
  };

  return (

    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}

        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-white transition hover:text-red-500"
        >
          MovieInvest
        </Link>

        {/* NAVIGATION */}

        <div className="flex items-center gap-3">

          <div className="relative">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search movies..."
              className="w-64 rounded-xl bg-zinc-800 px-4 py-2 text-white outline-none"
            />

            {search && (

              <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">

                {movies?.length > 0 ? (

                  movies.map((movie) => (

                    <div
                      key={movie.id}
                      onClick={() => {
                        navigate(`/movie/${movie.id}`);
                        setSearch('');
                      }}
                      className="cursor-pointer px-4 py-3 text-white hover:bg-zinc-800"
                    >
                      {movie.title}
                    </div>

                  ))

                ) : (

                  <div className="px-4 py-3 text-zinc-400">
                    No movies found
                  </div>

                )}

              </div>

            )}

          </div>

          <Link
            to="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            Home
          </Link>

          {token ? (
            <>

              <Link
                to="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Dashboard
              </Link>

              {/* ROLE BADGE */}

              {role === 'ADMIN' && (

                <Link
                  to="/admin"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Admin Panel
                </Link>

              )}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>

            </>
          ) : (

            <Link
              to="/login"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Login
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;