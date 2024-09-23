import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography'
import { fade } from '@material-ui/core/styles/colorManipulator';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import _ from '@lodash';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Divider, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core';
import clsx from "clsx";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PrismaZoom from "react-prismazoom";


const useStyles = makeStyles((theme) => ({
	backdrop: {
	  zIndex: theme.zIndex.drawer + 1,
	  color: "#fff",
	},
	cc:{
		backgroundColor: '#454545',
        border: 5,
        borderRadius: 3,
	    color: 'white',
        height: 35,
        padding: '10px 10px',
	    textAlign: 'center',
	    flex: 1,
	    width: 1000, 
        fontSize: 400,
		
	},
    numbers:{
		padding: '0px 0px',
		textAlign: 'center',
		fontSize: '1.4rem',
		fontWeight: '700',
	}
}))

function LaborGraph(props) {
	const theme = useTheme();
	const classes = useStyles(props);
	const [tabIndex, setTabIndex] = useState(0);
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);
	const [siteName, setSiteName] = useState('');
	const [laborData, setLaborData] = useState([]);
	const [manPower, setManPower] = useState(0);
		
	const data = {
		labels: props.data.label,
		datasets: [
			[
				{
					label: 'Man Power',
					data: props.data.count,
					backgroundColor: 'rgb(0, 150, 255)',
				}
			],
		],
	};

	const options = {
		spanGaps: true,
		legend: {
			display: false,
			position: "top",
			labels:{
				usePointStyle: true
			},			
		},
		maintainAspectRatio: true,
		responsive: true,
		elements: {
			point: {
				radius: 2,
				borderWidth: 1,
				hoverRadius: 2,
				hoverBorderWidth: 1
			},
			line: {
				tension: 0
			}
		},
		layout: {
			padding: {
				top: 32,
				left: 16,
				right: 16,
				bottom: 0
			}
		},
		scales: {
			xAxes: [
				{
					display: true
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
		plugins: {
			datalabels: {
			  display: true,
			  color: "black",
			  anchor: "end",
              offset: -20,
              align: "start",
			},
		},
		onClick: (e, element) => {
			if (element.length > 0) {
				callLaborData(data.labels[element[0]._index])	
			}
		},
	};
	_.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	_.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

	function callLaborData(site){
		if(props.labors !== undefined){
			let filterLb = props.labors.filter((lb) => lb.site === site);
			let temp = [];
            if(filterLb.length > 0){
				filterLb[0].laborData.map((lb)=>{
					if(lb.labourCount > 0){
                      temp.push(lb);
					}
				})
			}
			setLaborData(temp);
			setSiteName(site);
			setManPower(filterLb[0].manPower)
			setShow(true);
		}
	}

	return (
		<>
		    <Typography className= "font-bold mt-10 ml-10 cursor-pointer" onClick={()=> setOpen(true)}> Labor Count </Typography>
			<Bar
				data={{
					labels: data.labels,
					datasets: data.datasets[tabIndex].map(obj => ({
						...obj,
						borderColor: theme.palette.secondary.main
					}))
				}}
				plugins={[ChartDataLabels]}
				options={options}
				width={150} 
				height={70}
			/>
			<Dialog fullWidth open={open}>
              <DialogTitle id="alert-dialog-title">Labor Count </DialogTitle> 
              <DialogContent className="items-center justify-center">
                <div>
				    <PrismaZoom maxZoom={20} topBoundary={120}>
					    <Bar
				            data={{
					            labels: data.labels,
					            datasets: data.datasets[tabIndex].map(obj => ({
						         ...obj,
						         borderColor: theme.palette.secondary.main
					            }))
				            }}
				            plugins={[ChartDataLabels]}
				            options={options}
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
			<Dialog fullWidth maxWidth='md' open={show}>
              <DialogTitle id="alert-dialog-title">
			  <Grid container className={'mt-10'}>
				<Grid xs={6} >
					<Typography  className="font-bold text-left ml-10">{siteName} - Labor Data </Typography>
				</Grid>
				<Grid xs={5}>
					<Typography  className="font-bold text-right"> Total Man Power - {manPower} </Typography>	
				</Grid>
			</Grid>
			  </DialogTitle> 
              <DialogContent className="items-center justify-center">
				<Divider/>
				<div class="grid grid-cols-4">
				    {laborData.map((lb)=>(
					    <>
					      <Typography className= "font-bold mt-10">{lb.role} - {lb.labourCount}</Typography>
					    </>
				    ))}
				</div>
				<Divider/>
              </DialogContent>
              <DialogActions>
                <Button 
                    onClick={() =>{
                      setShow(false)
                    }}
                    variant="contained" 
                    color="primary"
                >
                  CLOSE
                </Button>
              </DialogActions>
            </Dialog>
		</>
	);
}

export default React.memo(LaborGraph);