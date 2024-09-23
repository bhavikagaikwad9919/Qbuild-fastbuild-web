import React from "react";
import { authRoles } from "app/auth";

export const PlanSummaryConfig = {
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
      path: "/projects/:projectId/plan summary",
      component: React.lazy(() => import("./PlanSummary")),
      exact: true,
    },
  ],
};
