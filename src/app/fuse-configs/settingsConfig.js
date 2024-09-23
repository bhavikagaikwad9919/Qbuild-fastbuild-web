const settingsConfig = {
	layout: {
		style: 'layout2', // layout-1 layout-2 layout-3
		config: {
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
		} // checkout default layout configs at app/fuse-layouts for example  app/fuse-layouts/layout1/Layout1Config.js
	},
	customScrollbars: true,
	animations: true,
	direction: 'ltr', // rtl, ltr
	theme: {
		main: 'legacy',
		navbar: 'legacy',
		toolbar: 'mainThemeLight',
		footer: 'mainThemeDark'
	}
};

export default settingsConfig;
