import React, { useState } from 'react';
import { Icon, Typography } from '@material-ui/core';
import FuseAnimate from '@fuse/core/FuseAnimate';
import BusinessIcon from '@material-ui/icons/Business';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	root: {
	  width: '100%',
	  maxWidth: 360,
	  maxHeight: '68vh',
	  position: 'relative',
	  overflow: 'auto',
	  backgroundColor: theme.palette.background.paper,
	},
	root1: {
	  display: 'flex-container',
	  maxHeight: '68vh',
	  backgroundColor: theme.palette.background.paper,
	  overflow: 'auto',
	},

	backdrop: {
	  zIndex: theme.zIndex.drawer + 1,
	  color: '#fff',
	},
  }));

function OrganizationHeader(props) {
	const classes = useStyles();
	const role = useSelector(({ auth }) => auth.user.role);

	return (
		<>
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-224">
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
					  <BusinessIcon className="text-32 mr-12"/>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6">
							Organizations
						</Typography>
					</FuseAnimate>
				</div>
			</div>
		</div>
		<div className="flex items-center px-8 h-full overflow-x-auto">
			{role !== 'admin' ?
			  <Button onClick={() => props.onOpen()} variant="contained" className="mb-8 mr-10" style={{padding:'3px 16px'}}>Add Organization</Button>:null
			}
	    </div>
	    </>
	);
}

export default OrganizationHeader;
