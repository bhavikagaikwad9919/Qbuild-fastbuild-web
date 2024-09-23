import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import { useTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
// import Tab from '@material-ui/core/Tab';
// import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import _ from '@lodash';

function Widget8(props) {

	let structural=props.data.filter((p)=>p.projectType === 'structuralAudit');
	let residential=props.data.filter((p)=>p.projectType === 'residential');
    let infrastucture=props.data.filter((p)=>p.projectType === 'infrastucture');
    let commercial=props.data.filter((p)=>p.projectType === 'commercial');
    let other=props.data.filter((p)=>p.projectType === 'other');
	let rescomm=props.data.filter((p)=>p.projectType === 'RES-COMM');
	let finalData=[structural.length,residential.length,infrastucture.length,commercial.length,other.length,rescomm.length];

	const theme = useTheme();
	const [tabIndex, setTabIndex] = useState(0);
	// const data = _.merge({}, props.data);
	const data = {
		id: 'widget8',
		datasets: [
			[
				{
					label: 'projects',
					data: finalData,
					fill: false,
					borderColor: '#5c84f1'
				}
			],
		],
		labels: ['Structural Audit', 'Residential', 'Commercial', 'Infrastructure', 'Others','Residential Cum Commercial'],

		today: props.data.length,
		change: {
			value: 321,
			percentage: 2.05
		}
	};
	const options = {
		spanGaps: true,
		legend: {
			display: false
		},
		maintainAspectRatio: true,
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
				top: 24,
				left: 16,
				right: 16,
				bottom: 16
			}
		},
		scales: {
			xAxes: [
				{
					display: false
				}
			],
			yAxes: [
				{
					display: true,
					ticks: {
						// min: 100,
						// max: 500
					}
				}
			]
		}
	};
	_.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	_.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

	return (
		<Card className="w-full rounded-8 shadow-1">
			<AppBar position="static">
				<div className="p-16 px-4 flex flex-row items-center justify-between">
					<div className="px-12">
						<Typography className="h1 font-300" color="inherit">
							Projects
						</Typography>
						<Typography className="h5" color="inherit">
							Total projects
						</Typography>
					</div>

					{/* <div>
						<IconButton aria-label="more" color="inherit">
							<Icon>more_vert</Icon>
						</IconButton>
					</div> */}
				</div>
				<div className="p-16 pt-8 flex flex-row justify-between items-end">
					<Typography className="text-center text-48 font-300 leading-none" color="inherit">
						{data.today}
					</Typography>
					{/* <div className="flex flex-row items-center">
						{data.change.value > 0 && <Icon className="text-green">trending_up</Icon>}
						{data.change.value < 0 && <Icon className="text-red">trending_down</Icon>}
						<div className="mx-8">
							{data.change.value}({data.change.percentage}%)
						</div>
					</div> */}
				</div>
				{/* <Tabs value={tabIndex} onChange={(ev, index) => setTabIndex(index)} variant="fullWidth">
					<Tab label="Resedential" className="min-w-0" />
					<Tab label="Commerical" className="min-w-0" />
					<Tab label="Others" className="min-w-0" />
				</Tabs> */}
			</AppBar>
			<Line
				data={{
					labels: data.labels,
					datasets: data.datasets[tabIndex].map(obj => ({
						...obj,
						borderColor: theme.palette.secondary.main
					}))
				}}
				options={options}
			/>
		</Card>
	);
}

export default React.memo(Widget8);
