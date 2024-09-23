import React from 'react';
import { authRoles } from 'app/auth';

export const ReportConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: true
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.project,
	routes: [
		{
			path: '/reportSummary',
			component: React.lazy(() => import('./ReportSummary'))
		}
	]
};
