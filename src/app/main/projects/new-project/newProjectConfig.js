import React from 'react';
import { authRoles } from 'app/auth';

export const NewProjectConfig = {
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
	auth: authRoles.project, //['admin']
	routes: [
		{
			path: '/projects/add',
			exact: true,
			component: React.lazy(() => import('./newProject'))
		}
	]
};
