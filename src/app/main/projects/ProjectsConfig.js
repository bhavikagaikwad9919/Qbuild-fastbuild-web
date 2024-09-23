import React from "react";
import { authRoles } from "app/auth";

const ProjectsConfig = {
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
  auth: authRoles.project, //['admin']
  routes: [
    {
      path: `/projects/:projectId`,
      component: React.lazy(() => import("./project-details/ProjectDetails")),
      exact: true,
    },
    {
      path: "/projects",
      component: React.lazy(() => import("./Projects")),
    },
  ],
};

export default ProjectsConfig;
