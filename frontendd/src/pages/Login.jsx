import { useState } from 'react';

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

    <div className="flex min-h-[90vh] items-center justify-center px-4">

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">

        {/* TOP SECTION */}

        <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-10 text-center">

          <h1 className="mb-2 text-4xl font-extrabold text-white">

            {tab === 'login'
              ? 'Welcome Back'
              : 'Create Account'}

          </h1>

          <p className="text-sm text-red-100">

            {tab === 'login'
              ? 'Sign in to continue investing in movies.'
              : 'Join MovieInvest and start your journey.'}

          </p>

        </div>

        {/* FORM SECTION */}

        <div className="p-8">

          {/* TABS */}

          <div className="mb-8 flex rounded-xl bg-zinc-800 p-1">

            <button
              onClick={() => setTab('login')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === 'login'
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setTab('register')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                tab === 'register'
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register
            </button>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* REGISTER FIELDS */}

            {tab === 'register' && (

              <>
                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  />

                </div>

                {/* ROLE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Select Role
                  </label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  >

                    <option value="USER">
                      USER
                    </option>

                  </select>

                </div>
              </>
            )}

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-red-500"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={
                isLoginLoading ||
                isRegisterLoading
              }
              className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {(isLoginLoading ||
                isRegisterLoading)
                ? 'Please wait...'
                : tab === 'login'
                ? 'Sign In'
                : 'Create Account'}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;