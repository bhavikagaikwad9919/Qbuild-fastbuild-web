import { useTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import _ from '@lodash';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core';
import moment from "moment";
import PrismaZoom from "react-prismazoom";

const useStyles = makeStyles((theme) => ({
	container: {
		position: "relative",
		margin: "auto",
		height: "35vh",
		width: "40vw",
	}
}));
 
function Widget8(props) {
	const classes = useStyles();
	const orgProjects = useSelector(({ organizations }) => organizations.projects);
	const sites = useSelector(({ organizations }) => organizations.organization.sites);
	const theme = useTheme();
	const [graphLabel, setGraphLabel] = useState([]);
	const [complete, setComplete] = useState([]);
    const [progress, setProgress] = useState([]);
    const [unable, setUnable] = useState([]);
    const [commence, setCommence] = useState([]);
	const [allProgressCount, setAllProgressCount] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(()=>{
		fetchData();
	}, [props.date])


	function fetchData(){
		let tempLables = [], allProgress = 0;
		let tempComplete= [], tempProgress= [],tempUnable= [],tempCommence= [], completedCount=0,progressCount=0, unableCount=0,commenceCount=0;
		(sites.forEach((o, id)=>{
			tempLables.push(o.name);
			let buildings = o.dataStructure.buildings;

            if(buildings.length > 0){
				buildings.forEach((bl)=>{
					if(bl.buildingData !== undefined){
						let tempArray = []
						bl.buildingData.map((bls)=>{
							if(process(moment(bls.statusDate).format('DD-MM-YYYY')) <= process(moment(props.date).format('DD-MM-YYYY'))){
							   tempArray.push(bls)
							}
						})
				
						let newArray = tempArray.sort(function(a, b) {
							return new Date(b.statusDate) - new Date(a.statusDate);
						});
					//	console.log(o.name, newArray, bl.name)
				
						if(newArray.length > 0){
						    if(newArray[0].buildingStatus ==="Completed"){
						        completedCount++;
						    }else if(newArray[0].buildingStatus ==="In Progress"){
						        progressCount++;
						        allProgress++;
						    }else if(newArray[0].buildingStatus ==="Unable To Start"){
						        unableCount++;
						    }else if(newArray[0].buildingStatus ==="To Commence Shortly"){
						        commenceCount++;
						    }
						}
					}
				})

				if(completedCount === 0){
					tempComplete.push(null)
				  }else{
					tempComplete.push(completedCount)
				  }
				  
				  if(progressCount === 0){
					tempProgress.push(null)
				  }else{
					tempProgress.push(progressCount)
				  }
				  
				  
				  if(unableCount === 0){
					tempUnable.push(null)
				  }else{
					tempUnable.push(unableCount)
				  }
				  
				  
				  if(commenceCount === 0){
					tempCommence.push(null)
				  }else{
					tempCommence.push(commenceCount)
				  }
			}else{
				tempComplete.push(null);
				tempProgress.push(null)
				tempUnable.push(null)
				tempCommence.push(null)
			}
			 
			completedCount = 0; progressCount = 0; unableCount = 0; commenceCount = 0;

            setComplete(tempComplete);
			setProgress(tempProgress);
			setUnable(tempUnable);
			setCommence(tempCommence)
		}));
		setGraphLabel(tempLables);

		setAllProgressCount(allProgress)
	}

	const arbitraryStackKey = "stack1";
	function dynamiunableCountolors() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgba(" + r + "," + g + "," + b + ", 0.5)";
    }

    const data = {
		labels : graphLabel,
		//plugins: [ChartDataLabels],
		datasets: [
			{
			  label: 'Completed',
			  //stack: arbitraryStackKey,
			  data: complete,
			  backgroundColor: '#0FFF50',
			  barThickness: 12
			},
			{
			  label: 'In Progress',
			  //stack: arbitraryStackKey,
			  data: progress,
			  backgroundColor: '#F4BB44',
			  barThickness: 12
			},
			{
			  label: 'To Commence Shortly',
			  //stack: arbitraryStackKey,
			  data: commence,
			  backgroundColor: '#1C4E80',
			  barThickness: 12
			},
			{
			  label: 'Unable To Start',
			  //stack: arbitraryStackKey,
			  data: unable,
			  backgroundColor: '#FF4C4C',
			  barThickness: 12
			},
		  ]
  
	};

	const options = {
		spanGaps: true,
		legend: {
			display: true,
			position: "top",
			labels:{
				usePointStyle: true
			}
		},
		maintainAspectRatio: true,
		responsive: true,
		plugins: {
			datalabels: {
			  display: true,
			  color: "black",
			  anchor: "end",
              offset: -20,
              align: "start",
			},
		},
		scales: {
			xAxes: [
				{
					display: true,
			        barThickness: 10,
				}
			],
			yAxes: [
				{
					display: true,
					ticks: {
						min: 0,
						// max: 500
					}
				}
			]
		},
	};
	_.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	_.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

	function process(date){
		var parts = date.split("-");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

	return (
		<div>
			<Grid container className={'mt-10'}>
				<Grid xs={6} >
					<Typography  className= "font-bold text-left ml-10 cursor-pointer" onClick={()=> setOpen(true)}> Building Status</Typography>
				</Grid>
				<Grid xs={5}>
					<Typography  className="font-bold text-right"> {allProgressCount} - In Progress </Typography>	
				</Grid>
			</Grid>
			<Bar
				data={data}
				plugins={[ChartDataLabels]}
				options={options}
				height="140"
			/>
			<Dialog fullWidth open={open}>
              <DialogTitle id="alert-dialog-title"> Building Status</DialogTitle> 
              <DialogContent className="items-center justify-center">
                <div>
				    <PrismaZoom maxZoom={20} topBoundary={120}>
					    <Bar
				          data={data}
				          plugins={[ChartDataLabels]}
				          options={options}
			        	  //height="140"
			            />
				    </PrismaZoom>
                </div> 
              </DialogContent>
              <DialogActions>
                <Button 
                    onClick={() =>{
                      setOpen(false)
                    }}
                    variant="contained" 
                    color="primary"
                >
                  CLOSE
                </Button>
              </DialogActions>
            </Dialog>
		</div>
	);
}

export default React.memo(Widget8);