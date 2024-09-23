import React, { useEffect,useState } from 'react';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import moment from "moment/moment";
import { getUsers } from 'app/main/users/store/usersSlice';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAllProjects } from 'app/main/projects/store/projectsSlice'

const useStyles = makeStyles((theme) => ({
	backdrop: {
	  zIndex: theme.zIndex.drawer + 1,
	  color: "#fff",
	},
  }));
function AdminDashboard(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const [loading, setLoading] = useState(false);
	const [userCount, setUsercount] = useState(
		{
			2020: [
			  {
				data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9],
			  },
			],
		  }
	);
	const [projectCount, setProjectCount] = useState([]);
  const [userData, setUserData] = useState([]);

  let year = new Date().getFullYear();
  let finalData={};

  useEffect(() => {
   getUsersCount();
   getProjectsCount();
  }, []);

  async function getUsersCount()
  {
    let setOfYears=[];
    setLoading(true)
    for(var i = 2020;i <= year; i++)
    {
       setOfYears.push(i);
    }

    await dispatch(getUsers()).then(async (response)=>{
      
      if(response.payload !== undefined)
      {
        setUserData(response.payload);
        setOfYears.forEach((years)=>{
          let count={};
           response.payload.forEach((user)=>{
             if(years.toString() === moment(user.createdAt).format("YYYY"))
             {
               count[moment(user.createdAt).format("M")] = (count[moment(user.createdAt).format("M")] || 0) + 1; 
             }
           })

           let data=[];
           for(var i=1;i<13;i++)
           {        
              if(count[i] === undefined)
              {
                data.push(0)
              }else{
                data.push(count[i])
              }
           }
           finalData[years]=[{data}];       
        })
      }
      setLoading(false)
	  setUsercount(finalData)
    });
  }

  async function getProjectsCount()
  {
	await dispatch(getAllProjects()).then(async (response)=>{
	    setProjectCount(response.payload)
	  });
  }

	return (
		<>
		 <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
         </Backdrop>
		<div className="w-full">
			<Widget1 data={userCount} />

			{/* <div className="mb-32">
				<div className="widget w-1/3 sm:w-1/4 md:w-1/3 p-16">
					<Widget2 />
				</div>
				<div className="widget w-1/3 sm:w-1/4 md:w-1/3 p-16">
					<Widget3 />
				</div>
			</div> */}
			<div className="flex flex-col sm:flex sm:flex-row pb-32">
				<div className="widget flex w-full sm:w-1/3 p-16">
					<Widget2 data={projectCount} />
				</div>

				<div className="widget flex w-full sm:w-1/3 p-16">
					<Widget3 data={userData}/>
				</div>
			</div>
		</div>
		</>
	);
}

// export default AdminDashboard;
export default withReducer('admin', reducer)(AdminDashboard);

// export default withStyles(styles, { withTheme: true })(Example);
