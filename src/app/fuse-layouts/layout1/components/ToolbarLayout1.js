import FuseSearch from '@fuse/core/FuseSearch';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';

const useStyles = makeStyles(theme => ({
	root: {}
}));

function ToolbarLayout1(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const classes = useStyles(props);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx(classes.root, 'flex relative z-10')}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
				elevation={2}
			>
				<Toolbar className="p-0">
					{config.navbar.display && config.navbar.position === 'left' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-48 h-48 p-0" />
						</Hidden>
					)}

					<div className="flex flex-1">
						<Hidden mdDown>
							<FuseShortcuts className="px-16" />
						</Hidden>
					</div>

					<div className="flex items-center px-16">
						<LanguageSwitcher />

						<FuseSearch />

						<QuickPanelToggleButton />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton />
						</Hidden>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout1);
