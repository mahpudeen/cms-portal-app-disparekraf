
const routes: any[] = [
    {
        path: '/setting/menu',
        name: 'Menu List',
        component: () => import('./Index.vue'),
        meta: {
            requiresAuth: true,
            title: 'Menu List',
            breadcrumbs : [
                {
                    title: 'Internal Settings',
                    disabled: true,
                    href: '#'
                  },
                  {
                    title: 'Menu List',
                    disabled: true,
                    href: '#'
                  }
            ]
        }
    }
];

export default routes;
