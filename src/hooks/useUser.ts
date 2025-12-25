// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
  changePassword,
  type UserResponse,
  type ApiResponse,
} from "../services/userService";
import {
  type CreateUserInput,
  type UpdateUserInput,
  type LoginInput,
  type ChangePasswordInput,
} from "@/lib/validations/user";
import { MutationConfig } from "@/lib/react-query";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), { ...filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  current: ["current-user"] as const,
};

// Query hooks
export const useUsers = (params?: Record<string, unknown>) => {
  return useQuery<ApiResponse<UserResponse[]>, Error>({
    queryKey: userKeys.list(params || {}),
    queryFn: () => getUsers(params),
  });
};

export const useUser = (id: number) => {
  return useQuery<ApiResponse<UserResponse>, Error>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
  });
};

export const useCurrentUser = () => {
  return useQuery<ApiResponse<UserResponse>, Error>({
    queryKey: userKeys.current,
    queryFn: getCurrentUser,
    retry: false,
  });
};

// Mutation hooks
export const useCreateUser = (config?: MutationConfig<typeof createUser>) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserResponse>, Error, CreateUserInput>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...config,
  });
};

export const useUpdateUser = (config?: MutationConfig<typeof updateUser>) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserResponse>,
    Error,
    { id: number } & UpdateUserInput
  >({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.current });
    },
    ...config,
  });
};

export const useDeleteUser = (config?: MutationConfig<typeof deleteUser>) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...config,
  });
};

export const useLogin = (config?: MutationConfig<typeof login>) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ token: string; user: UserResponse }>, Error, LoginInput>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.success && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        queryClient.invalidateQueries({ queryKey: userKeys.current });
      }
    },
    ...config,
  });
};

export const useChangePassword = (config?: MutationConfig<typeof changePassword>) => {
  return useMutation<ApiResponse<void>, Error, ChangePasswordInput>({
    mutationFn: changePassword,
    ...config,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("token");
    queryClient.clear();
    queryClient.invalidateQueries({ queryKey: userKeys.current });
  };
};