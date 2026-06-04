import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  useLoginMutation,
  useRegisterMutation,
} from '../store/apiSlice';

import { useDispatch } from 'react-redux';

import { setCredentials } from '../store/authSlice';

import { useNavigate } from 'react-router-dom';

const Login = () => {

  // ================= STATE =================

  const [tab, setTab] = useState('login');

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [name, setName] = useState('');

  const [role, setRole] =
    useState('USER');

  // ================= API =================

  const [
    login,
    { isLoading: isLoginLoading },
  ] = useLoginMutation();

  const [
    register,
    { isLoading: isRegisterLoading },
  ] = useRegisterMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (tab === 'login') {

        const userData = await login({
          email,
          password,
        }).unwrap();

        dispatch(
          setCredentials({
            token: userData.token,
            userId: userData.userId,
            role: userData.role,
          })
        );
        toast.success("Logged in successful!");

      } else {

        const userData = await register({
          name,
          email,
          password,
          role,
        }).unwrap();

        dispatch(
          setCredentials({
            token: userData.token,
            userId: userData.userId,
            role: userData.role,
          })
        );
        toast.success("Registration successful!");
      }

      navigate('/');

    } catch (err) {

      console.error(
        'Authentication failed',
        err
      );

      alert(
        'Authentication failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950">

      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[45vh] max-w-7xl items-center justify-center px-6">

        {/* LEFT SIDE */}
        <div className="hidden w-1/2 lg:flex lg:flex-col lg:justify-center">

          <div className="max-w-md">

            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-red-600/10 text-3xl backdrop-blur">
              🎬
            </div>

            <h1 className="text-3xl font-black leading-tight text-white">
              MovieInvest
            </h1>

            <p className="mt-4 text-base leading-7 text-zinc-400">
              Invest in movie projects, support talented creators,
              and become part of the next blockbuster success story.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="text-xl font-bold text-red-400">
                  100%
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Transparent Investments
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="text-xl font-bold text-red-400">
                  Secure
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Protected Transactions
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* AUTH CARD */}
        <div className="w-full max-w-sm lg:w-1/2 lg:max-w-md">

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-[0_0_50px_rgba(220,38,38,0.12)] backdrop-blur-xl">

            {/* HEADER */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-6 py-6">

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <span className="text-xl">🎬</span>
              </div>

              <h1 className="text-center text-2xl font-black text-white">
                {tab === 'login'
                  ? 'Welcome Back'
                  : 'Create Account'}
              </h1>

              <p className="mt-1 text-center text-xs text-red-100">
                {tab === 'login'
                  ? 'Sign in to continue investing in movies'
                  : 'Join MovieInvest and start your journey'}
              </p>

            </div>

            {/* CONTENT */}
            <div className="p-6">

              {/* TOGGLE */}
              <div className="mb-5 rounded-xl bg-zinc-800 p-1">

                <div className="grid grid-cols-2 gap-1">

                  <button
                    onClick={() => setTab('login')}
                    className={`rounded-lg py-2 text-xs font-semibold transition
                    ${tab === 'login'
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setTab('register')}
                    className={`rounded-lg py-2 text-xs font-semibold transition
                    ${tab === 'register'
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    Register
                  </button>

                </div>

              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>

                {tab === 'register' && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-300">
                        Full Name
                      </label>

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-300">
                        Role
                      </label>

                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                      >
                        <option value="USER">Investor</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoginLoading || isRegisterLoading}
                  className="mt-1 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {(isLoginLoading || isRegisterLoading)
                    ? 'Please wait...'
                    : tab === 'login'
                      ? 'Sign In'
                      : 'Create Account'}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;