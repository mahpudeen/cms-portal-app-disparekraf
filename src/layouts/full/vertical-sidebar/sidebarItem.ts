

export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Welcome',
    icon: 'mdi-monitor-dashboard',
    to: '/'
  },
  { divider: true },
  { header: 'Internal Setting' },

  {
    title: 'Users',
    icon: 'mdi-account-circle',
    to: '/setting/users'
  },
  {
    title: 'Bidang',
    icon: 'mdi-account-tie-outline',
    to: '/setting/bidang'
  },
  {
    title: 'Roles',
    icon: 'mdi-account-multiple',
    to: '/setting/roles'
  },
  {
    title: 'Menu',
    icon: 'mdi-menu',
    to: '/setting/menu'
  },
  // {
  //   title: 'Settings',
  //   icon: 'mdi-account-cog-outline',
  //   to: '/forms/radio',
  //   children: [
  //     {
  //       title: 'Users',
  //       to: '/users'
  //     },
  //     {
  //       title: 'Roles',
  //       to: '/roles'
  //     },
  //     {
  //       title: 'System',
  //       to: '/system'
  //     }
  //   ]
  // },
];

export default sidebarItem;
