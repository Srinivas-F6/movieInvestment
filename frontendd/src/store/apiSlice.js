import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ['Movie', 'Investment', 'User'],

  endpoints: (builder) => ({

    // ================= AUTH =================

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // ================= MOVIES =================

    getMovies: builder.query({
      query: () => '/movies',
      providesTags: ['Movie'],
    }),

    getMovieById: builder.query({
      query: (id) => `/movies/${id}`,
      providesTags: ['Movie'],
    }),

    getMoviesByProducer: builder.query({
      query: (producerId) => `/movies/producer/${producerId}`,
      providesTags: ['Movie'],
    }),

    createMovie: builder.mutation({
      query: ({ movieData, producerId }) => ({
        url: `/movies/producer/${producerId}`,
        method: 'POST',
        body: movieData,
      }),
      invalidatesTags: ['Movie'],
    }),

    // UPDATE MOVIE STATUS
    updateMovieStatus: builder.mutation({
      query: ({ movieId, status }) => ({
        url: `/movies/${movieId}/status`,
        method: 'PUT',
        params: {
          status,
        },
      }),
    }),

    searchMovies: builder.query({
      query: (title) => ({
        url: `/movies/search`,
        params: { title },
      }),
    }),

    // ================= INVESTMENTS =================

    getInvestmentsForMovie: builder.query({
      query: (movieId) => `/investments/movie/${movieId}`,
      providesTags: ['Investment'],
    }),

    getInvestmentsForUser: builder.query({
      query: (userId) => `/investments/user/${userId}`,
      providesTags: ['Investment'],
    }),

    investInStage: builder.mutation({
      query: ({ stageId, movieId, userId, slotsToBuy }) => ({
        url: `investments/stages/${stageId}/${movieId}/${userId}/invest`,
        method: 'POST',
        params: {
          slotsToBuy,
        },
      }),
    }),

    createStage: builder.mutation({
      query: ({ movieId, stageName, amount }) => ({
        url: `/investments/${movieId}/stages`,
        method: 'POST',
        params: {
          stageName,
          amount,
        },
      }),
      invalidatesTags: ['Movie'],
    }),

    getStagesByMovie: builder.query({
      query: (movieId) => ({
        url: `investments/${movieId}/stages`,
        method: 'GET',
      }),
      providesTags: ['Stage'],
    }),

    updateStageStatus: builder.mutation({
      query: ({ stageId, status }) => ({
        url: `/investments/stage/${stageId}/status`,
        method: 'PUT',
        params: {
          status,
        },
      }),
    }),
  }),
});

export const {
  // AUTH
  useLoginMutation,
  useRegisterMutation,

  // MOVIES
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useGetMoviesByProducerQuery,
  useCreateMovieMutation,
  useUpdateMovieStatusMutation,
  useSearchMoviesQuery,

  // INVESTMENTS
  useGetInvestmentsForMovieQuery,
  useGetInvestmentsForUserQuery,
  useInvestInStageMutation,
  useCreateStageMutation,
  useGetStagesByMovieQuery,
  useUpdateStageStatusMutation,
} = apiSlice;