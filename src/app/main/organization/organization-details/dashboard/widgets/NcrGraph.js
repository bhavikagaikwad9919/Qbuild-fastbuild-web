import { useTheme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import _ from '@lodash';
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core';
import PrismaZoom from "react-prismazoom";
import { useDispatch, useSelector } from "react-redux";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ReactTable from "react-table-6";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
	  maxHeight: "68vh",
	},
}))

function NcrGraph(props) {
	const classes = useStyles(props);
	const dispatch = useDispatch();
	const theme = useTheme();
	const projectId = useSelector(({ projects }) => projects.details._id);
	const userId = useSelector(({ auth }) => auth.user.data.id)
	const [labels, setLabels] = useState(['Open', 'Closed']);
	const [count, setCount] = useState([0, 0]);
	const [open, setOpen] = useState(false);
	const [ncrData, setNcrData] = useState([]);
	const [show, setShow] = useState(false);
	const [type, setType] = useState('');

	useEffect(() => {
		let lb = [], ct = [];
		if(props.data.countData !== undefined){
			props.data.countData.forEach((pd)=>{
				lb.push(pd.status);
				ct.push(pd.count);
			}) 
		}

	   if(lb.length > 0){
		setLabels(lb);
	  }
	  
	  if(ct.length > 0){
		setCount(ct);
	  }
	}, [props]);
		
    const data = {
        labels,
        datasets: [
          {
            label: '# of Votes',
            data: count,
            backgroundColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
    };

	const options = {
		spanGaps: true,
		legend: {
			display: true,
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
		onClick: (e, element) => {
			if (element.length > 0) {
				callNcrData(data.labels[element[0]._index])
			}
		},
	};
	_.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	_.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

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
				 var text = count[0] + count[1],
				 textX = Math.round((width - ctx.measureText(text).width) / 2),
				 textY = height / 1.7;
				 ctx.fillText(text, textX, textY);
				 ctx.save();
			} 
		}
	];

	function callNcrData(status){
		setType(status)
		if(props.data.openNcr !== undefined && status === 'Open'){
			setNcrData(props.data.openNcr)
			setShow(true);
		}else if(props.data.closedNcr !== undefined && status === 'Closed'){
			setNcrData(props.data.closedNcr)
			setShow(true);
		}
	}

	const downloadDocument = (data) =>{
		if(data.ncrDoc === undefined){
			dispatchWarningMessage(dispatch, "NCR document not found.")
		}else{
			if(data.ncrDoc.length > 0){
				const url = data.ncrDoc[0].pictureUrl;
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `${data.ncrDoc[0].name}`);
				document.body.appendChild(link);
				link.click();
			}else{
				dispatchWarningMessage(dispatch, "NCR document not found.")
			}
		}
		
	}

	return (
		<>
			<Typography className= "font-bold mt-10 text-center cursor-pointer" onClick={()=> setOpen(true)}> Quality NCR </Typography>
			<Doughnut
				data={data}
				plugins={plugins}
				options={options}
				width={280}
			/>
			<Dialog fullWidth open={open}>
              <DialogTitle id="alert-dialog-title"> Quality NCR </DialogTitle> 
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

			<Dialog fullWidth maxWidth='md' open={show}>
              <DialogTitle id="alert-dialog-title">
			  <Grid container className={'mt-10'}>
				<Grid xs={6} >
					<Typography  className="font-bold text-left ml-10">{type} - Quality NCR - {ncrData.length}</Typography>
				</Grid>
				<Grid xs={5}>
					<Typography  className="font-bold text-right"> </Typography>	
				</Grid>
			</Grid>
			  </DialogTitle> 
          <DialogContent className="items-center justify-center">
		  <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            data={ncrData}
           // defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            columns={[
              {
                Header: "Site",
                accessor: "siteName",
                filterable: true,
				width: 150,
				className: "font-bold",
                style: { textAlign:"center",'whiteSpace': 'unset' },
              },
              {
                Header: "Ref No",
                accessor: "refNo",
                filterable: true,
				className: "font-bold",
                style: { textAlign:"center",'whiteSpace': 'unset' },
              },
              {
                Header: 'Download',
				width: 150,
                id: 'view_po',
                style: { textAlign:"center",'whiteSpace': 'unset' },
                accessor: "view",
                Cell: ({ row }) => (
                  <>
                   <a className="cursor-pointer" onClick={() => downloadDocument(row._original)}> Download </a>
                  </>
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={5}
            noDataText="No Data found"
          />
              </DialogContent>
              <DialogActions>
                <Button 
                    onClick={() =>{
                      setShow(false)
					  setNcrData([])
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

export default React.memo(NcrGraph);
