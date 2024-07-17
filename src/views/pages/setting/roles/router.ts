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
  {
    path: '/setting/roles/assign/:id',
    name: 'Roles Assign',
    component: () => import('./Assign.vue'),
    meta: {
      requiresAuth: true,
      title: 'Roles Assign',
      breadcrumbs: [
        {
          title: 'Internal Settings',
          disabled: true,
          href: '#'
        },
        {
          title: 'Roles List',
          disabled: false,
          href: '/setting/roles'
        },
        {
          title: 'Roles Assign',
          disabled: true,
          href: '#'
        }
      ]
    }
  },

  {
    path: '/setting/roles/detail/:id',
    name: 'Roles Detail',
    component: () => import('./Assign.vue'),
    meta: {
      requiresAuth: true,
      title: 'Roles Assign',
      breadcrumbs: [
        {
          title: 'Internal Settings',
          disabled: true,
          href: '#'
        },
        {
          title: 'Roles List',
          disabled: false,
          href: '/setting/roles'
        },
        {
          title: 'Roles Detail',
          disabled: true,
          href: '#'
        }
      ]
    }
  }
];

export default routes;
