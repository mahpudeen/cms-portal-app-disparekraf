import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuthStore } from '@/stores/auth';

// Importing modules and collecting routes asynchronously
async function importModules() {
  const modules = import.meta.glob('../views/**/*.ts');

  for (const path in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, path)) {
      const routeModule: any = await modules[path]();
      MainRoutes.children.push(...routeModule.default);
    }
  }
}

// Initialize the router
async function initializeRouter() {
  await importModules();

  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
      },
      MainRoutes,
      AuthRoutes,
    ]
  });
}

// Export the router
export const router = await initializeRouter();

interface User {
  // Define the properties and their types for the user data here
  // For example:
  id: number;
  name: string;
}

// Assuming you have a type/interface for your authentication store
interface AuthStore {
  user: User | null;
  returnUrl: string | null;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth: AuthStore = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return next('/auth/login');
    } else next();
  } else {
    next();
  }
});
