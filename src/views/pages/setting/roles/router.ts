const routes: any[] = [
  {
    path: '/setting/roles',
    name: 'Roles List',
    component: () => import('./rolesList.vue'),
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
    path: '/setting/roles/create',
    name: 'Roles Create', // Ensure this name matches the one used in navigateToCreate
    component: () => import('./rolesCreate.vue'), // Update the path to your 'Roles Create' component
    meta: {
      requiresAuth: true,
      title: 'Create Role',
      breadcrumbs: [
        {
          title: 'Internal Settings',
          disabled: true,
          href: '#'
        },
        {
          title: 'Roles List',
          href: '/setting/roles'
        },
        {
          title: 'Create Role',
          disabled: true,
          href: '#'
        }
      ]
    }
  }
];

export default routes;
