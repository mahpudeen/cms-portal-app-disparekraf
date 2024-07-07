const routes: any[] = [
  {
    path: '/setting/users',
    name: 'Users List',
    component: () => import('@/views/pages/setting/users/List.vue'),
    meta: {
      requiresAuth: true,
      title: 'Users List',
      breadcrumbs: [
        {
          title: 'Internal Settings',
          disabled: true,
          href: '#'
        },
        {
          title: 'Users List',
          disabled: true,
          href: '#'
        }
      ]
    }
  }
];

export default routes;
