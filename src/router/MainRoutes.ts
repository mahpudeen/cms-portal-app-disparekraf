const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'UsersPage',
      path: '/setting/users',
      component: () => import('@/views/pages/users/Index.vue')
    },
    {
      name: 'RolesPage',
      path: '/setting/roles',
      component: () => import('@/views/pages/roles/Index.vue')
    },
    {
      name: 'SystemsPage',
      path: '/setting/system',
      component: () => import('@/views/pages/system/Index.vue')
    },
  ]
};

export default MainRoutes;
