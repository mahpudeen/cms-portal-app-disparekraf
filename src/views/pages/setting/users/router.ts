
const routes: any[] = [
    {
        path: '/setting/users',
        name: 'Users List',
        component: () => import('./Index.vue'),
        meta: {
            requiresAuth: true,
            title: 'Users List',
            breadcrumbs : [
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
