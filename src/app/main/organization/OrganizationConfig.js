import React from "react";
import { authRoles } from "app/auth";

export const OrganizationConfig = {
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
      path: `/organization/details/:organizationId`,
      component: React.lazy(() => import("./organization-details/organizationDetails")),
    },
    {
      path: `/organization`,
      component: React.lazy(() => import("./Organization")),
    },
  ],
};

