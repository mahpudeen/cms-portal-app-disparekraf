const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'UsersPage',
      path: '/setting/users',
      component: () => import('@/views/pages/users/Index.vue')
    },
    {
      name: 'BidangPage',
      path: '/setting/bidang',
      component: () => import('@/views/pages/setting/bidang/Index.vue')
    },
    {
      name: 'RolesPage',
      path: '/setting/roles',
      component: () => import('@/views/pages/roles/Index.vue')
    },
    {
      name: 'MenuPage',
      path: '/setting/menu',
      component: () => import('@/views/pages/setting/menu/Index.vue')
    },
  ]
};

export default MainRoutes;
