import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import _ from '@lodash';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core';
import PrismaZoom from "react-prismazoom";

function GfcGraph(props) {
	const labels= ['Received', 'Pending'];
	const [open, setOpen] = useState(false); 

    const data = {
        labels,
        datasets: [
          {
            label: 'Gfc Count',
            data: props.data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
          },
        ],
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
		layout: {
			padding: {
				top: 2,
				left: 2,
				right: 2,
				bottom: 2
			}
		},
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
		responsive: true,
		layout: {
			padding: {
				top: 24,
				left: 16,
				right: 16,
				bottom: 16
			}
		}, 
		datalabels: {
			display: true,
			color: "white"
		  }
	};

	const getSuitableY = (y, yArray = [], direction) => {
		let result = y;
		yArray.forEach((existedY) => {
		  if (existedY - 14 < result && existedY + 14 > result) {
			if (direction === "right") {
			  result = existedY + 14;
			} else {
			  result = existedY - 14;
			}
		  }
		});
	  
		return result;
	};

	const plugins = [
		{
		  afterDraw: (chart) => {
			const ctx = chart.chart.ctx;
			ctx.save();
			ctx.font = "20px 'Averta Std CY'";
			const leftLabelCoordinates = [];
			const rightLabelCoordinates = [];
			const chartCenterPoint = {
			  x:
				(chart.chartArea.right - chart.chartArea.left) / 2 +
				chart.chartArea.left,
			  y:
				(chart.chartArea.bottom - chart.chartArea.top) / 2 +
				chart.chartArea.top
			};
			chart.config.data.labels.forEach((label, i) => {
			  const meta = chart.getDatasetMeta(0);
			  const arc = meta.data[i];
			  const dataset = chart.config.data.datasets[0];
	  
			  // Prepare data to draw
			  // important point 1
			  const centerPoint = arc.getCenterPoint();
			  const model = arc._model;
			  let color = model.borderColor;
			  let labelColor = model.borderColor;
			  if (dataset.polyline && dataset.polyline.color) {
				color = dataset.polyline.color;
			  }
	  
			  if (dataset.polyline && dataset.polyline.labelColor) {
				labelColor = dataset.polyline.labelColor;
			  }
	  
			  const angle = Math.atan2(
				centerPoint.y - chartCenterPoint.y,
				centerPoint.x - chartCenterPoint.x
			  );
			  // important point 2, this point overlapsed with existed points
			  // so we will reduce y by 14 if it's on the right
			  // or add by 14 if it's on the left
			  const point2X =
				chartCenterPoint.x + Math.cos(angle) * (model.outerRadius + 15);
			  let point2Y =
				chartCenterPoint.y + Math.sin(angle) * (model.outerRadius + 15);
	  
			  let suitableY;
			  if (point2X < chartCenterPoint.x) {
				// on the left
				suitableY = getSuitableY(point2Y, leftLabelCoordinates, "left");
			  } else {
				// on the right
	  
				suitableY = getSuitableY(point2Y, rightLabelCoordinates, "right");
			  }
	  
			  point2Y = suitableY;
	  
			  let value = dataset.data[i];
			  if (dataset.polyline && dataset.polyline.formatter) {
				value = dataset.polyline.formatter(value);
			  }
			  let edgePointX = point2X < chartCenterPoint.x ? 10 : chart.width - 10;
	  
			  if (point2X < chartCenterPoint.x) {
				leftLabelCoordinates.push(point2Y);
			  } else {
				rightLabelCoordinates.push(point2Y);
			  }
			  //DRAW CODE
			  // first line: connect between arc's center point and outside point
			  ctx.strokeStyle = color;
			  ctx.beginPath();
			  ctx.moveTo(centerPoint.x, centerPoint.y);
			  ctx.lineTo(point2X, point2Y);
			  ctx.stroke();
			  // second line: connect between outside point and chart's edge
			  ctx.beginPath();
			  ctx.moveTo(point2X, point2Y);
			  ctx.lineTo(edgePointX, point2Y);
			  ctx.stroke();
			  //fill custom label
			  const labelAlignStyle =
				edgePointX < chartCenterPoint.x ? "left" : "right";
			  const labelX = edgePointX;
			  const labelY = point2Y;
			  ctx.textAlign = labelAlignStyle;
			  ctx.textBaseline = "bottom";

			  ctx.fillStyle = labelColor;
			  ctx.fillText(value, labelX, labelY);
			});
			ctx.restore();
		  }
		},
		{
			beforeDraw: function(chart) {
			 var width = chart.width,
				 height = chart.height,
				 ctx = chart.ctx;
				 ctx.restore();
				 var fontSize = (height / 140).toFixed(2);
				 ctx.font = fontSize + "em roboto";
				 ctx.textBaseline = "top";
				 var text = props.data[0] + props.data[1],
				 textX = Math.round((width - ctx.measureText(text).width) / 2),
				 textY = height / 1.7;
				 ctx.fillText(text, textX, textY);
				 ctx.save();
			} 
		}
	];
	// _.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	// _.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

	return (
		<>
			<Typography className= "font-bold mt-10 text-center cursor-pointer" onClick={()=> setOpen(true)}> GFC Drawing Tracker </Typography>
			<Doughnut
				data={data}
				plugins={plugins}
				options={options}
				width={280}
			/>
			<Dialog fullWidth open={open}>
              <DialogTitle id="alert-dialog-title"> GFC Drawing Tracker </DialogTitle> 
              <DialogContent className="items-center justify-center">
                <div>
				    <PrismaZoom maxZoom={20} topBoundary={120}>
				    	<Doughnut
				           data={data}
				           plugins={plugins}
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
		</>
	);
}

export default React.memo(GfcGraph);
