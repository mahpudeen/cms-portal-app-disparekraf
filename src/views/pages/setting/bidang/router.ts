
const routes: any[] = [
    {
        path: '/setting/bidang',
        name: 'Bidang List',
        component: () => import('./Index.vue'),
        meta: {
            requiresAuth: true,
            title: 'Bidang List',
            breadcrumbs : [
                {
                    title: 'Internal Settings',
                    disabled: true,
                    href: '#'
                  },
                  {
                    title: 'Bidang List',
                    disabled: true,
                    href: '#'
                  }
            ]
        }
    }
];

export default routes;
