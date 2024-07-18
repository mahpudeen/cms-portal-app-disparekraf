import bidangRouter from './bidang/router';
import menuRouter from './menu/router';
import rolesRouter from './roles/router';
import usersRouter from './users/router';

export const routerSettings = [
    ...bidangRouter,
    ...menuRouter,
    ...rolesRouter,
    ...usersRouter,
];