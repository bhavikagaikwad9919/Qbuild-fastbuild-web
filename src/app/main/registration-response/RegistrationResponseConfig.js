import React from 'react';
import { authRoles } from 'app/auth';

export const RegistartionResponseConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
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
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/users/:id/:token/verify',
			component: React.lazy(() => import('./RegistrationResponse'))
		}
	]
};
