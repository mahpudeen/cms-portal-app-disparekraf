const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue'),
      meta: {
        requiresAuth: true,
        title: 'Dashboard Welcome',
        breadcrumbs: [
            {
                title: 'Dashboard',
                disabled: true,
                href: '#'
            },
            {
                title: 'Welcome',
                disabled: true,
                href: '#'
            }
        ]
    }
    }
  ]
};

import { routerSettings } from '../views/pages/setting/router';
routerSettings.forEach(element => {
  MainRoutes.children.push(element);
});
export default MainRoutes;
