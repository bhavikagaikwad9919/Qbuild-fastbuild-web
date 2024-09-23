import React, { useState, useEffect } from 'react';
import { Icon, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { openNewDialog, back} from "../store/organizationSlice";

function OrganizationHeader(props) {
	const dispatch = useDispatch();
	const details = useSelector(({ organizations }) => organizations.organization);
	const userId = useSelector(({ auth }) => auth.user.data.id);
	const members = useSelector( ({ organizations }) => organizations.members);
	const user = useSelector(({ auth }) => auth.user);
	const selectedRoutes = useSelector(({ organizations }) => organizations.routes);
    const [hide, setHide] = useState(false)
    const [access, setAccess] = useState(false);
	let orgType = details.orgType;
    useEffect(() => {
		if((userId === details.createdBy) || user.role === 'admin')
		{
			setAccess(true)
		}else{
			members.forEach((t)=>{  
				if(t._id === user.data.id && t.designation !== "owner")
				{
				   const member = t.access.filter((i)=>i === selectedRoutes);
				   console.log(member)
				   if(member.length > 0)
				   {
					 setAccess(true)
				   }
				}

				if(t._id === user.data.id && t.designation === "CIDCO Official"){
					setHide(true)
				}
			})
		}
    }, [access, members]);

	return (
		<>
			<div className="flex flex-1 items-center justify-between w-full p-8 sm:p-24">
				{/* <div className="items-center sm:w-224"> */}
				<div className="flex flex-col items-start w-full">
					<FuseAnimate animation="transition.slideRightIn" delay={300}>
						<Typography
							className="normal-case flex items-center sm:mb-12"
							component={Link}
							role="button"
							to={`/organization/${userId}`}
							onClick={() => {
								dispatch(back());
							}}
							color="inherit"
						>
							<Icon className=" ml-20 text-20">arrow_back</Icon>
							Organization
						</Typography>
					</FuseAnimate>
					<div className="flex flex-row w-full">
					{/* <BusinessIcon className="text-32 mr-12"/> */}
						<Typography className="mx-12 items-center w-full" variant="h5">
							{details.name}
						</Typography>
					</div>
				</div>
			</div>
			{orgType === 'SSA'?
			  <div className="flex flex-1 items-end justify-end gap-6 mb-20">
			  {props.tab === 0 && access  && hide === false ? 
				<Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Add Member</Button>
			  :props.tab === 1 && access  && hide === false ?
				<Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Add Site</Button>
			  :props.tab === 2 && access  && hide === false ?
				<Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Create Project</Button>
			  :selectedRoutes === 'Agency' && hide === false ?
				<Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Add Agency</Button>
			  :null}	
		  </div>
			:
			<div className="flex flex-1 items-end justify-end gap-6 mb-20">
				{props.tab === 0 && access ? 
				  <Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Add Member</Button>
				:props.tab === 1 && access ?
				  <Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Create Project</Button>
				:selectedRoutes === 'Agency' ?
				  <Button variant="contained" onClick={()=> dispatch(openNewDialog())}>Add Agency</Button>
				:null}
			</div>
			}
			
		</>
	);
}

export default OrganizationHeader;
