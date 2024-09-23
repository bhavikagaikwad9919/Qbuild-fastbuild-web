import React from 'react';
import { authRoles } from 'app/auth';

export const DataConfig = {
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
			path: '/dataStructure',
			component: React.lazy(() => import('./DataStructure'))
		}
	]
};
