"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import myAxios from "@/lib/axios/myAxios";
import { toastMessage } from "@/lib/toast";

interface Response<T> {
  total_elements: number;
  total_pages: number;
  has_next: boolean;
  page_number: number;
  page_size: number;
  results: T[];
  infos?: {
    employee_count: number;
    beneficiary_count: number;
    global_total: number;
    company_total: number;
    employee_total: number;
  };
}

export function useFetch<T>(
  key: string,
  url: string,
  enabled = true,
  options?: Omit<UseQueryOptions<Response<T>>, "queryKey" | "queryFn">,
) {
  return useQuery<Response<T>>({
    queryKey: [key, { url }],
    queryFn: async () => {
      const response = await myAxios.get<Response<T>>(url);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
}

export function useFetchOne<T>(
  key: string,
  url: string,
  enabled = true,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) {
  return useQuery<T>({
    queryKey: [key, url],
    queryFn: async () => {
      const response = await myAxios.get<T>(url);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
}

type MutationApiOptions<T, V> = UseMutationOptions<T, unknown, V> & {
  invalidateKeys?: QueryKey[];
  getData?: (variables: V) => unknown;
};

export function useMutationApi<T, V>(
  url: string | ((variables: V) => string),
  method:
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | ((variables: V) => "POST" | "PUT" | "PATCH" | "DELETE"),
  options?: MutationApiOptions<T, V>,
) {
  const queryClient = useQueryClient();
  const {
    invalidateKeys = [],
    getData,
    onError,
    onSuccess,
    ...mutationOptions
  } = options ?? {};

  return useMutation<T, unknown, V>({
    mutationFn: async (data: V) => {
      const resolvedUrl = typeof url === "function" ? url(data) : url;
      const resolvedMethod =
        typeof method === "function" ? method(data) : method;
      const response = await myAxios.request<T>({
        url: resolvedUrl,
        method: resolvedMethod,
        data: getData ? getData(data) : data,
      });
      return response.data;
    },
    onSuccess: async (data, variables, context, mutationContext) => {
      await Promise.all(
        invalidateKeys.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      await onSuccess?.(data, variables, context, mutationContext);
    },
    onError: (error, variables, context, mutationContext) => {
      const errorMessages = formatMutationError(error);
      toastMessage(errorMessages || "Une erreur est survenue.", "error");
      onError?.(error, variables, context, mutationContext);
    },
    ...mutationOptions,
  });
}

function formatMutationError(error: unknown): string {
  if (error instanceof AxiosError) {
    return formatErrorMessages(error.response?.data);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "";
}

function formatErrorMessages(errorObj: unknown, prefix = ""): string {
  if (!errorObj || typeof errorObj !== "object") {
    return typeof errorObj === "string" ? errorObj : "";
  }

  return Object.entries(errorObj)
    .map(([key, value]) => {
      const newPrefix = prefix ? `${prefix} > ${key}` : key;

      if (typeof value === "string") {
        return `${newPrefix}: ${value}`;
      }

      if (Array.isArray(value)) {
        return `${newPrefix}: ${value.join(", ")}`;
      }

      if (typeof value === "object") {
        return formatErrorMessages(value, newPrefix);
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
}
