import articlesRouter from './articles/router';
import dashboardRouter from './dashboard/router';

export const routerJacations = [
    ...articlesRouter,
    ...dashboardRouter,
];