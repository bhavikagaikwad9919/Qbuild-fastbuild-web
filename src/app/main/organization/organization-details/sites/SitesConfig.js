import React from "react";
import { authRoles } from "app/auth";

export const SiteConfig = {
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
      path: `/site/:organizationId/:siteId`,
      component: React.lazy(() => import("./sitesDetails/siteDetails")),
    },
  ],
};

