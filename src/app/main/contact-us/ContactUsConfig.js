import React from "react";
import { authRoles } from "app/auth";

export const ContactUsConfig = {
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
      path: "/contact-us",
      component: React.lazy(() => import("./ContactUs")),
    },
  ],
};
