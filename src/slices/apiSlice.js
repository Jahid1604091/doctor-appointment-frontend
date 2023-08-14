import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials":true,
  },
  credentials: "include",
  SameSite:"None",
  Secure:true
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Doctors"],
  endpoints: (builder) => ({}),
});

export const countryApiSlice = createApi({
  reducerPath: "api2",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://parseapi.back4app.com/classes/BD_BD?count=1",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set(
        "X-Parse-Application-Id",
        "YzDylnYKFUzln2bDr3GNHuQjnD2oXIDTKfO52vSw"
      );
      headers.set(
        "X-Parse-REST-API-Key",
        "LDMYcw2DF06WKpo5gC4Tkqyzmb83tiGDSheCHzw4"
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCountryStateCity: builder.query({
      query: () => ``,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetCountryStateCityQuery } = countryApiSlice;
