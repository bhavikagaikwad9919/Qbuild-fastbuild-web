import React from 'react';
import { authRoles } from 'app/auth';
const ResetPasswordConfig = {
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
			path: '/users/:id/:token/password/:value',
			component: React.lazy(() => import('./ResetPassword'))
		}
	]
};

export default ResetPasswordConfig;
