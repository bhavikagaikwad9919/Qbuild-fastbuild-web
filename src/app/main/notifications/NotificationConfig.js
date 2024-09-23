import React from 'react';
import { authRoles } from 'app/auth';

export const NotificationConfig = {
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
  auth: authRoles.project,
  routes: [
    {
      path: '/notification',
      component: React.lazy(() => import('./Notification')),
    },
  ],
};
