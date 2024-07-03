import {
  CircleIcon,
  WindmillIcon,
  TypographyIcon,
  ShadowIcon,
  PaletteIcon,
  KeyIcon,
  UserCircleIcon,
  UsersIcon,
  SettingsCodeIcon,
  BugIcon,
  DashboardIcon,
  BrandChromeIcon,
  HelpIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
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
    icon: DashboardIcon,
    to: '/'
  },
  { divider: true },
  { header: 'Internal Setting' },

  {
    title: 'Settings',
    icon: SettingsCodeIcon,
    to: '/forms/radio',
    children: [
      {
        title: 'Users',
        icon: CircleIcon,
        to: '/users'
      },
      {
        title: 'Roles',
        icon: CircleIcon,
        to: '/roles'
      },
      {
        title: 'System',
        icon: CircleIcon,
        to: '/system'
      }
    ]
  },
];

export default sidebarItem;
