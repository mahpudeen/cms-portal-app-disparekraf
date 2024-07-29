import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import axios from '@/plugins/axios';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null,
    menu: localStorage.getItem('menu') ? JSON.parse(localStorage.getItem('menu')!) : null,
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      // const user:any = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
      const user:any = await axios.post('/auth/login', { "nip_or_email":username, "password": password });
      console.log(user.data?.user);
      // update pinia state
      this.user = user.data?.user;
      this.token = user.data?.token;
      this.menu = user.data?.modules_menus;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user.data?.user));
      localStorage.setItem('token', JSON.stringify(user.data?.token));
      localStorage.setItem('menu', JSON.stringify(user.data?.modules_menus));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/');
    },
    logout() {
      this.user = null;
      this.token = null;
      this.menu = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('menu');
      router.push('/auth/login');
    }
  }
});
