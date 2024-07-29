import { defineStore } from 'pinia';

export const usePermissionStore = defineStore({
  id: 'permission',
  state: () => ({
    permission: {
      read: false,
      write: false,
      delete: false,
      update: false,
    }
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    setPermission(payload: any) {
      this.permission = payload;
      // this.counter++;
    },
  }
});
