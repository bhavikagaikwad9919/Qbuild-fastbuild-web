import React from "react";
import { authRoles } from "app/auth";

const PlanViewConfig = {
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
  auth: authRoles.project,
  routes: [
    {
      path: "/projects/:projectId/plans/pdf",
      component: React.lazy(() => import("./PlanPdf")),
    },
    {
      path: [
        "/projects/:projectId/plans/:planId/view/:zoom",
        "/projects/:projectId/plans/:planId/view",
      ],
      component: React.lazy(() => import("./PlanView")),
    },
  ],
};

export default PlanViewConfig;
