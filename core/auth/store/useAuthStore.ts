import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { UserToken, User, Credentials, RegisterData } from '../interfaces';
import {
  signin,
  changePassword,
  checkStatus,
  deleteAccount,
  resetPassword,
  signup,
  verifyCode,
} from '../actions';
import { Exception } from '@/core/interfaces/exception.interface';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  signin: (credentials: Credentials) => Promise<UserToken | Exception>;
  signup: (values: RegisterData) => Promise<User | Exception>;
  deleteAccount: () => Promise<User | Exception>;
  checkStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  verifyCode: (
    username: string,
    verificationCode: string
  ) => Promise<UserToken | Exception>;
  setAuthenticated: (token: string, user: User) => void;
  setUnauthenticated: () => void;
  setUser: (user: User) => void;
  resetPassword: (username: string) => Promise<User | Exception>;
  changePassword: (password: string) => Promise<UserToken | Exception>;
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
    const response = await deleteAccount();
    await SecureStore.deleteItemAsync('token');

    if ('email' in response) {
      get().setUnauthenticated();
      return response;
    }

    return response;
  },

  checkStatus: async () => {
    const response = await checkStatus();
    console.warn({ CheckStatusResponse: response });

    if ('token' in response) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response.user);
      return true;
    }

    if (!response) {
      get().setUnauthenticated();
      return false;
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
    return response;
  },

  setAuthenticated: (token: string, user: User) => {
    set({
      status: 'authenticated',
      token: token,
      user: user,
    });
    console.warn('Authenticated');
  },

  setUnauthenticated: () => {
    set({
      status: 'unauthenticated',
      token: undefined,
      user: undefined,
    });
    console.warn('Unauthenticated');
  },

  setUser: (user: User) => {
    set({
      user: user,
    });
  },
}));
