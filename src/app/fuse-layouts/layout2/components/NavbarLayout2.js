import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Logo from 'app/fuse-layouts/shared-components/Logo';
//import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import React from 'react';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import Menu from 'app/fuse-layouts/shared-components/Menu';
import { useLocation } from 'react-router-dom';

function NavbarLayout2() {
	const location = useLocation();
	return (
		<div className="flex flex-auto justify-between items-center w-full h-full container p-0 lg:px-24">
			<div className="flex flex-auto mx-8">
				<Logo />
			</div>

			<div className="flex flex-auto mx-8">
			   {/* <Menu /> */}
		  	   {/* <Navigation layout="horizontal" /> */}
			</div>
			
            {location.pathname === "/onBoarding" || location.pathname === "/onboarding" ? null :
			    <FuseScrollbars className="flex h-full items-center">
				  <UserMenu />
			    </FuseScrollbars>
            }
		</div>
	);
}

export default React.memo(NavbarLayout2);
