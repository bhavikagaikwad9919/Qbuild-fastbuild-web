import { useTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import { Bar,Line, StackBar } from 'react-chartjs-2';
import _ from '@lodash';
import { Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core';
import moment from "moment";
import PrismaZoom from "react-prismazoom";
import ChartDataLabels from 'chartjs-plugin-datalabels';

function Widget8(props) {
	const theme = useTheme();
	const [labels, setLabels] = useState([]);
	const [planCost, setPlanCost] = useState([]);
    const [actualCost, setActualCost] = useState([]);
    const [cumulativePlanCost, setCumulativePlanCost] = useState([]);
    const [cumulativeActualCost, setCumulativeActualCost] = useState([]);
	const [totalActualCost, setTotalActualCost] = useState(0)
	const [open, setOpen] = useState(false);

    useEffect(()=>{
	    let tempLabels = [], tempPlanCost = [], tempActualCost = [], tempCumulativePlanCost = [], tempCumulativeActualCost = [];
 
		if(props.data !== undefined){
			props.data.map((flow, id)=>{
				tempLabels.push(flow.formatMonth);
				tempPlanCost.push(Math.round(flow.planCost.toFixed(2)));
				tempCumulativePlanCost.push(Math.round(flow.cumulativePlanCost.toFixed(2)));
				if(process(flow.formatMonth) <= process(moment(new Date(props.reportDate)).format('DD-MM-YYYY'))){
					if(flow.actualCost > 0){
						tempActualCost.push(Math.round(flow.actualCost.toFixed(2)));
						tempCumulativeActualCost.push(Math.round(flow.cumulativeActualCost.toFixed(2)));
					}
				}
			})
		}
	   

	   setLabels(tempLabels);
	   setPlanCost(tempPlanCost);
	   setActualCost(tempActualCost);
	   setCumulativePlanCost(tempCumulativePlanCost);
	   setCumulativeActualCost(tempCumulativeActualCost);
	   if(tempCumulativeActualCost.length > 0){
		setTotalActualCost(tempCumulativeActualCost[tempCumulativeActualCost.length -1])
	   }else{
		setTotalActualCost(0)
	   }
	}, [props])

	function process(date){
		var parts = date.split("-");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

    const data = {
		labels,
		datasets: [
			{
				"yAxisID":'A',
				type: "line",
				label: 'Cumulative Actual Cost',
				data: cumulativeActualCost,
				fill: false,
				borderColor: 'rgb(255, 191, 0)',
				backgroundColor: 'rgb(255, 191, 0)',
				datalabels: {
					formatter: function(value, context) {
						if (context.dataIndex === context.dataset.data.length - 1)
						{
							return value.y;
						}
						return "";
					}
				}
			},
			{
				"yAxisID":'A',
				type: "line",
				datalabels: {
					formatter: function(value, context) {
						if (context.dataIndex === context.dataset.data.length - 1)
						{
							return value.y;
						}
						return "";
					}
				},
				label: 'Cumulative Planned Cost',
				data: cumulativePlanCost,
				fill: false,
				borderColor: 'rgb(178, 102, 255)',
				backgroundColor: 'rgb(178, 102, 255)',
			},
			{
			    "yAxisID":'B',
			    type: "bar",
			    label: 'Planned Cost',
			    data: planCost,
			    backgroundColor: 'rgb(255, 99, 132)',
		    },
		    {
			    "yAxisID":'B',
			    type: "bar",
			    label: 'Actual Cost',
			    data: actualCost,
			    backgroundColor: 'rgb(53, 162, 235)',
		    },
		],
	};

	const options = {
		spanGaps: true,
		plugins: {
			datalabels: {
			  display: true,
			  color: "black",
			  anchor: "end",
              offset: -20,
              align: "start",
			},
		},
		legend: {
			display: true,
			labels: {
			  usePointStyle: true,
			  pointStyle: 'circle',
			},
		},
		maintainAspectRatio: true,
		responsive: true,
		scales: {
			xAxes: [
				{
					display: true,
				}
			],
			yAxes: [
				{
				  id: 'A',
				  position: 'right',
				},
				{        
				  id: 'B',
				}
			],
		},
	};
	_.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	_.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

	return (
		<>
			<Grid container className={'mt-10'}>
				<Grid xs={6} >
					<Typography  className="font-bold text-left ml-10 cursor-pointer" onClick={()=> setOpen(true)}> Project Cash Flow(In Cr) </Typography>
				</Grid>
				<Grid xs={5}>
					<Typography  className="font-bold text-right"> {totalActualCost} - Actual Cost </Typography>	
				</Grid>
			</Grid>
			<Bar
				data={data}
				//plugins={[ChartDataLabels]}
				options={options}
			    width="600" height="280"	
			/>
			<Dialog  fullWidth maxWidth='md' open={open}>
              <DialogTitle id="alert-dialog-title"> Project Cash Flow(In Cr)</DialogTitle> 
              <DialogContent className="items-center justify-center">
                <div>
				    <PrismaZoom maxZoom={20} topBoundary={120}>
                        <Bar
				          data={data}
				          plugins={[ChartDataLabels]}
				          options={options}
			              //width="600" height="280"	
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
		</>
	);
}

export default React.memo(Widget8);