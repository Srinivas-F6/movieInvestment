import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log(token);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ['Movie', 'Investment', 'User','Stage', 'InvestorDashboard'],

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

    currentUser: builder.query({
      query: () => '/auth/currentUser',
      providesTags: ['User'],
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

    searchMovies: builder.query({
      query: (title) => ({
        url: `/movies/search`,
        params: { title },
      }),
    }),

    settleMovie: builder.mutation({
      query: ({ movieId, amount }) => ({
        url: `/settlements/${movieId}`,
        method: "POST",
        body: {
          amount,
        },
      }),
      invalidatesTags: ["Movie", "InvestorDashboard"],
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
      invalidatesTags: ['Investment', 'Stage', 'Movie'],
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
      invalidatesTags: ['Movie', 'Stage'],
    }),

    getStagesByMovie: builder.query({
      query: (movieId) => ({
        url: `investments/${movieId}/stages`,
        method: 'GET',
      }),
      providesTags: ['Stage'],
    }),


    getInvestorDashboard: builder.query({
      query: () => "/settlements/userDashboard",
      providesTags: ["InvestorDashboard"],
    }),

    // ================= Admin Panel =================

    updateStageStatus: builder.mutation({
      query: ({ stageId, status }) => ({
        url: `/investments/stages/${stageId}/status`,
        method: 'PUT',
        params: {
          status,
        },
      }),
      invalidatesTags: ['Stage', 'Movie'],
    }),

    hideMovie: builder.mutation({
      query: (movieId) => ({
        url: `/movies/${movieId}/hide`,
        method: 'PUT',
      }),
      invalidatesTags: ['Movie'],
    }),

    unhideMovie: builder.mutation({
      query: (movieId) => ({
        url: `/movies/${movieId}/unhide`,
        method: 'PUT',
      }),
      invalidatesTags: ['Movie'],
    }),

    updateMovieStatus: builder.mutation({
      query: ({ movieId, status }) => ({
        url: `/movies/${movieId}/status`,
        method: 'PUT',
        params: {
          status,
        },
      }),
      invalidatesTags: ['Movie'],
    }),

    updateUserRole: builder.mutation({
      query: ({ email, role }) => ({
        url: `movies/admin/users/${email}/role`,
        method: 'PUT',
        params: {
          role,
        },
      }),
      invalidatesTags: ['User'],
    }),

    deleteMovie: builder.mutation({
      query: (movieId) => ({
        url: `/movies/delete/${movieId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movie'],
    }),

    deleteStage: builder.mutation({
      query: (stageId) => ({
        url: `/investments/stages/${stageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stage', 'Movie'],
    }),

  }),
});


export const {
  // AUTH
  useLoginMutation,
  useRegisterMutation,
  useCurrentUserQuery,

  // MOVIES
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useGetMoviesByProducerQuery,
  useCreateMovieMutation,
  useSearchMoviesQuery,
  useSettleMovieMutation,


  // INVESTMENTS
  useGetInvestmentsForMovieQuery,
  useGetInvestmentsForUserQuery,
  useInvestInStageMutation,
  useCreateStageMutation,
  useGetStagesByMovieQuery,
  useGetInvestorDashboardQuery,

  // AdminPanel 
  useUpdateMovieStatusMutation,
  useHideMovieMutation,
  useUnhideMovieMutation,
  useUpdateStageStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteMovieMutation,
  useDeleteStageMutation,

} = apiSlice;