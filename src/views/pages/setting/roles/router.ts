const routes: any[] = [
  {
    path: '/setting/roles',
    name: 'Roles List',
    component: () => import('./Index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Roles List',
      breadcrumbs: [
        {
          title: 'Internal Settings',
          disabled: true,
          href: '#'
        },
        {
          title: 'Roles List',
          disabled: true,
          href: '#'
        }
      ]
    }
  },
];

export default routes;
