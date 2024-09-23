import React from 'react';
import { Icon, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';

function UserHeader(props) {
	const details = useSelector(({ users }) => users.details);
	const [blocked, setBlocked] = React.useState(false);
	return (
		<>
			<div className="flex flex-1 items-center justify-start p-8 sm:p-24">
				{/* <div className="items-center sm:w-224"> */}
				<div className="items-start max-w-full">
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<Typography
							className="normal-case flex items-center sm:mb-12"
							component={Link}
							role="button"
							to="/users"
							onClick={() => {
								// dispatch(Actions.back());
							}}
							color="inherit"
						>
							<Icon className="mr-4 text-20">arrow_back</Icon>
							Users
						</Typography>
					</FuseAnimate>
					<div className="flex flex-row w-full">
						<Avatar className="w-40 h-40" src={details.user.profilePicture} />
						<Typography className="mx-12 items-center w-full" variant="h5">
							{details.user.name}
						</Typography>
						<Chip size="small" style={{ backgroundColor: 'green' }} label={details.user.status} />
					</div>
				</div>
			</div>
			<div className="flex flex-1 items-end justify-end gap-6 mb-20">
				{/* <Button variant="contained">Reset Password</Button> */}
				{/* <ToggleButton
					style={{ backgroundColor: '#DCDCDC', color: 'black' }}
					value="check"
					label="Block"
					size="small"
					selected={blocked}
					onChange={() => {
						setBlocked(!blocked);
					}}
				>
					Block
				</ToggleButton> */}
			</div>
		</>
	);
}

export default UserHeader;
