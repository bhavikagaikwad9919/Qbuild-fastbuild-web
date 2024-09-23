import React from "react";
import { authRoles } from "app/auth";

export const privacyPolicyConfig = {
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
  auth: authRoles.everyOne,
  routes: [
    {
      path: "/privacy-policy",
      component: React.lazy(() => import("./privacyPolicy")),
    },
  ],
};

export default privacyPolicyConfig;
