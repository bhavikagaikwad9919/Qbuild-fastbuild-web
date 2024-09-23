import React from 'react';
import { authRoles } from 'app/auth';

export const VerifyUserConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
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
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/verify-user/:id',
      component: React.lazy(() => import('./VerifyUser')),
    },
  ],
};
