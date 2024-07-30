
const routes: any[] = [
    {
        path: '/jacation/dashboard',
        name: 'Dashboard Jacation',
        component: () => import('./Index.vue'),
        meta: {
            requiresAuth: true,
            title: 'Dashboard Jacation',
            breadcrumbs : [
                {
                    title: 'Jacation',
                    disabled: true,
                    href: '#'
                  },
                  {
                    title: 'Dashboard Jacation',
                    disabled: true,
                    href: '#'
                  }
            ]
        }
    },
];

export default routes;
