

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
    title: 'Roles',
    icon: 'mdi-account-multiple',
    to: '/setting/roles'
  },
  {
    title: 'System',
    icon: 'mdi-account-cog-outline',
    to: '/setting/system'
  },
];

export default sidebarItem;
