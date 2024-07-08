
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
    },
    {
        path: '/setting/menu/detail/:id',
        name: 'Menu Detail List',
        component: () => import('./Detail.vue'),
        meta: {
            requiresAuth: true,
            title: 'Menu Detail List',
            breadcrumbs : [
                {
                    title: 'Internal Settings',
                    disabled: true,
                    href: '#'
                  },
                  {
                    title: 'Menu List',
                    disabled: false,
                    href: '/setting/menu'
                  },
                  {
                    title: 'Menu Detail List',
                    disabled: true,
                    href: '#'
                  },
            ]
        }
    }
];

export default routes;
