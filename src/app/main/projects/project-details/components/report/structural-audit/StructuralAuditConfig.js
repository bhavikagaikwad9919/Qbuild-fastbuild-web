import React from "react";
import { authRoles } from "app/auth";

export const StructuralAuditConfig = {
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
      path: "/projects/:projectId/structural audit",
      component: React.lazy(() => import("./StructuralAudit")),
      exact: true,
    },
  ],
};
