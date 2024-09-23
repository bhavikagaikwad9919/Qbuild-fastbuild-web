import React from "react";
import { authRoles } from "app/auth";

export const termsConfig = {
  settings: {
    layout: {
        config: {
            navbar        : {
                display: false
            },
            toolbar       : {
                display: false
            },
            footer        : {
                display: false
            },
            leftSidePanel : {
                display: false
            },
            rightSidePanel: {
                display: false
            }
        }
    }
},
  auth: authRoles.everyOne,
  routes: [
    {
      path: "/terms",
      component: React.lazy(() => import("./terms")),
    },
  ],
};

export default termsConfig;
