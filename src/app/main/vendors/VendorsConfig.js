import React from 'react';
import { authRoles } from 'app/auth';

export const VendorsConfig = {
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
			path: '/vendors',
			component: React.lazy(() => import('./Vendors'))
		}
	]
};
