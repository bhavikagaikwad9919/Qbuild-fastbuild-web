import React from 'react';
import { authRoles } from 'app/auth';
const RegisterConfig = {
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
			path: '/invite/:refCode/register1',
			component: React.lazy(() => import('../login/Login'))//.Register
		},
		{
			path: '/register1',
			component: React.lazy(() => import('../login/Login'))//.Register
		}
	]
};

export default RegisterConfig;
