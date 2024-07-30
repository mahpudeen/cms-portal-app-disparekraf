const routes: any[] = [
    {
        path: '/jacation/articles',
        name: 'Articles List',
        component: () => import('./Index.vue'),
        meta: {
            requiresAuth: true,
            title: 'Articles List',
            breadcrumbs: [
                {
                    title: 'Jacation',
                    disabled: true,
                    href: '#'
                },
                {
                    title: 'Articles List',
                    disabled: true,
                    href: '#'
                }
            ]
        }
    }
];

export default routes;
