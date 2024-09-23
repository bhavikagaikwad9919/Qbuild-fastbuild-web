import React from "react";
import { authRoles } from "app/auth";

const UsersConfig = {
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
  auth: authRoles.admin, //['admin']
  routes: [
    {
      path: `/users/:userId`,
      component: React.lazy(() => import("./user-details/UserDetails")),
    },
    {
      path: "/users",
      component: React.lazy(() => import("./Users")),
    },
  ],
};

export default UsersConfig;
