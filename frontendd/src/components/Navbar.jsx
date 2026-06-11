import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import { useSearchMoviesQuery } from "../store/apiSlice";
import { logout } from "../store/authSlice";


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, role } = useSelector(
    (state) => state.auth
  );

  const roleLower = role ? role.toLowerCase() : null;

  const [search, setSearch] = useState("");

  const { data: movies } = useSearchMoviesQuery(search, {
    skip: !search,
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successful!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold tracking-wide text-white transition hover:text-red-500"
        >
          MovieInvest
        </Link>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          {token && (
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-52 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-red-500"
              />

              {search && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
                  {movies?.filter((movie) => !movie.hidden).length > 0 ? (
                    movies
                      ?.filter((movie) => !movie.hidden)
                      .map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => {
                            navigate(`/movie/${movie.id}`);
                            setSearch("");
                          }}
                          className="cursor-pointer px-3 py-2 text-sm text-white transition hover:bg-zinc-800"
                        >
                          {movie.title}
                        </div>
                      ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-zinc-400">
                      No movies found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {token ? (
            <>
              <Link
                to="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Dashboard
              </Link>

              {role && (
                <Link
                  to={
                    role === "ADMIN"
                      ? "/admin"
                      : role === "PRODUCER"
                        ? "/producer"
                        : role === "USER"
                          ? "/user"
                          : "/"
                  }
                  className="rounded-md px-3 py-2 text-sm font-medium text-white  transition hover:bg-zinc-800 hover:text-white"
                >
                  {roleLower.charAt(0).toUpperCase()+roleLower.slice(1)}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-red-600 px-3 py-2 text-sm  font-medium  text-white transition hover:bg-red-700"
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