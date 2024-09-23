import React from 'react';
import { authRoles } from 'app/auth';

export const DashboardConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.project, //['admin']
  routes: [
    {
      path: '/dashboard',
      component: React.lazy(() => import('./dashboard')),
    },
  ],
};
