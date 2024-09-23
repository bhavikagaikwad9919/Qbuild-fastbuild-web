import React from 'react';
import { authRoles } from 'app/auth';

export const OnBoardingConfig = {
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
			path: '/onBoarding',
			component: React.lazy(() => import('./OnBoarding'))
		}
	]
};