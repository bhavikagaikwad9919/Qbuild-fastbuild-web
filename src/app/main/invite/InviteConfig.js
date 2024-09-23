import React from 'react';
import { authRoles } from 'app/auth';

export const InviteConfig = {
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
			path: '/invite',
			component: React.lazy(() => import('./Invite'))
		}
	]
};
