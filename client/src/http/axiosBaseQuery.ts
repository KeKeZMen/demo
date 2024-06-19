import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosRequestConfig } from "axios";

import $api from "./axiosApi";

type AxiosQueryType = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

export const axiosBaseQuery = ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }): BaseQueryFn<AxiosQueryType, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await $api({ url: baseUrl + url, method, data, params });
      
      return { data: result.data };
    } catch (axiosError) {
      let error = axiosError as any;

      return {
        error: error.response?.data.message
      };
    }
  };
