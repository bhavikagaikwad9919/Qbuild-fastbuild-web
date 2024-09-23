import React from "react";
import { authRoles } from "app/auth";

export const refundPolicyConfig = {
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
      path: "/refund-policy",
      component: React.lazy(() => import("./refundPolicy")),
    },
  ],
};

export default refundPolicyConfig;
