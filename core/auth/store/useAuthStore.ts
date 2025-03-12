import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { User } from '@/core/auth/interfaces/user.interface';
import { RegisterData } from '@/core/auth/interfaces/register.data';
import {
  checkStatus,
  signin,
  signup,
  verifyCode,
  changePassword,
  resetPassword,
  deleteAccountAction,
} from '@/core/auth/actions';
import { UserTokenResponse } from '../interfaces/signin-response.interface';
import { Exception } from '@/core/interfaces/Exception.interface';
import { Credentials } from '../interfaces/credentials.interface';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  signin: (credentials: Credentials) => Promise<UserTokenResponse | Exception>;
  signup: (values: RegisterData) => Promise<User | Exception>;
  deleteAccount: () => Promise<User | Exception>;
  checkStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  verifyCode: (
    username: string,
    verificationCode: string
  ) => Promise<UserTokenResponse | Exception>;
  setAuthenticated: (token: string, user: User) => void;
  setUnauthenticated: () => void;
  setUser: (user: User) => void;
  resetPassword: (username: string) => Promise<User | Exception>;
  changePassword: (password: string) => Promise<UserTokenResponse | Exception>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,

  signin: async (credentials: Credentials) => {
    const response = await signin(credentials);

    if ('token' in response) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response.user);
      return response;
    }

    get().setUnauthenticated();
    return response;
  },

  signup: async (data: RegisterData) => {
    const response = await signup(data);
    if ('email' in response) {
      set({
        status: 'unauthenticated',
        token: undefined,
        user: response,
      });
      return response;
    }

    get().setUnauthenticated();
    return response;
  },

  deleteAccount: async () => {
    const response = await deleteAccountAction();
    if ('email' in response) {
      get().setUnauthenticated();
      return response;
    }

    return response;
  },

  checkStatus: async () => {
    const response = await checkStatus();

    if (!response) {
      get().setUnauthenticated();
      return false;
    }

    if ('token' in response) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response.user);
      return true;
    }

    get().setUnauthenticated();
    return false;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    get().setUnauthenticated();
  },

  verifyCode: async (username: string, verificationCode: string) => {
    const response = await verifyCode(username, verificationCode);
    if ('token' in response) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response.user);
      return response;
    }
    return response;
  },

  resetPassword: async (username: string) => {
    const response = await resetPassword(username);
    if ('id' in response) {
      set({ user: response });
      return response;
    }
    return response;
  },

  changePassword: async (password: string) => {
    const response = await changePassword(password);
    if ('token' in response) {
      set({ user: response.user });
      return response;
    }
    return response;
  },

  setAuthenticated: (token: string, user: User) => {
    set({
      status: 'authenticated',
      token: token,
      user: user,
    });
  },

  setUnauthenticated: () => {
    set({
      status: 'unauthenticated',
      token: undefined,
      user: undefined,
    });
  },

  setUser: (user: User) => {
    set({
      user: user,
    });
  },
}));
