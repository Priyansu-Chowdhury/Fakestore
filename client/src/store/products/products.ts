import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../types/types";

const baseUrl = import.meta.env.BACKEND_URL || "http://localhost:4000";

type ProductsResponse = {
  success: boolean;
  data: Product[];
};

type GetSingleProductResponse = {
  success: boolean;
  data: Product;
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl + "/api/v1/" }),
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => "products",
      providesTags: ["Products"],
    }),
    getProductsById: builder.query<GetSingleProductResponse, string>({
      query: (id) => `products/${id}`,
      providesTags: ["Product"],
    }),
    getProductsByIds: builder.mutation<ProductsResponse, string[]>({
      query: (ids) => ({
        url: `products/ids`,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["Products"],
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: `products/new`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: `products/update/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products", "Product"],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useGetProductsByIdsMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
