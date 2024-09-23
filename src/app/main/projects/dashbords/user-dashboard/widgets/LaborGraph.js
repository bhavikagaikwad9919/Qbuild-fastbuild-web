import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import { Typography } from '@material-ui/core';

function LaborGraph(props) {
	const [labels, setLabels] = useState([]);
	const [laborData, setLaborData] = useState([]);


    useEffect(()=>{
	  let tempLabels = [], tempData = []
		if(props.data !== undefined){
            props.data.map((dt)=>{
              tempLabels.push(moment(dt.dates).format("DD-MM-YYYY"));
              tempData.push(dt.manPower)
            })
	        setLabels(tempLabels);
            setLaborData(tempData)
		}
	}, [props])

    const data = {
		labels: labels,
		datasets: [{
			///label: 'Daily Labor Count',
			data: laborData,
			fill: false,
			borderColor: '#27408b',
			tension: 0.1,
			backgroundColor: '#FFCCCC',
		}]
	  };
	  
	const options = {
		spanGaps: true,
		legend: {
			display: false,
			align: 'start',
			labels: {
				boxWidth: 0,
				fontColor: '#fb654e',
				fontStyle: 'bold',
				fontSize: 14,
			},
		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					display: false
				},
			}],
		    yAxes: [{
			    gridLines: {
			      display: false
			    },
			    ticks: {
			      display: false
			    }
		    }]
		},
		// tooltips: {
		// 	callbacks: {
		// 		title: (tooltipItem, data) => {
		// 			const date = new Date(2023, 3, tooltipItem[0].index);
		// 			const options = { month: 'long', day: 'numeric', year: 'numeric' };
		// 			return date.toLocaleDateString('en-US', options);
		// 		},
		// 		label: (tooltipItem, data) => {
		// 			return `Count: ${tooltipItem.yLabel}`;
		// 		}
		// 	}
		// },
		maintainAspectRatio: true,
	    responsive: true,
		layout: {
			padding: {
				top: 24,
				left: 16,
				right: 16,
				bottom: 16
			}	
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
	};

	return (
		<div style={{ width: '100%', height: 'auto' }}>
			<Typography className='ml-10 mt-10 font-bold'>Daily Labor Count</Typography>
		    <Line
		        data={data}
		        width={window.innerWidth}
		        height={300}
		        options={options}
		        plugins={[ChartDataLabels]}
		    />
	    </div>
	);
}

export default React.memo(LaborGraph);