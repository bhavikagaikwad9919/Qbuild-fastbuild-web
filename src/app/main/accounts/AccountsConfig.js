import React from "react";
import { authRoles } from "app/auth";

const AccountsConfig = {
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
      path: `/accounts/:userId`,
      component: React.lazy(() => import("./AccountDetails")),
    },
  ],
};

export default AccountsConfig;
