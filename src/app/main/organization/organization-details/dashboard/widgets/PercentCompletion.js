import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
//import GaugeChart from 'react-gauge-chart';
import Gauge from "react-svg-gauge";
import { Typography,Divider, Grid} from '@material-ui/core';
import clsx from "clsx";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import moment from "moment";

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
        marginTop: '4px',
	},
    numbers:{
		padding: '0px 0px',
		textAlign: 'center',
		fontSize: '1.4rem',
		fontWeight: '700',
	},
    responsive:{
        minWidth:'100%', maxWidth:'100%', minHeight:'100%', maxHeight:'100%'
    }
}))

function PercentCompletion(props){
    const chartData = [10.76, 89.24];
    const showData = chartData[0] / chartData[1];
    const classes = useStyles(props);
    const [completion, setCompletion] = useState(0)
    const [manHours, setManHours] = useState(0);
	const [planCost, setPlanCost] = useState(0);
    const [actualCost, setActualCost] = useState(0);
    const [cumulativePlanCost, setCumulativePlanCost] = useState(0);
    const [cumulativeActualCost, setCumulativeActualCost] = useState(0);
	const cashFlowData = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);

    useEffect(()=>{
	    let tempCompletion = 0, tempData = [];

        if(cashFlowData.length > 0){
          cashFlowData.map((flow, id)=>{
            if(process(flow.formatMonth) <= process(moment(new Date(props.reportDate)).format('DD-MM-YYYY'))){
               tempData.push(flow)
            }
          })

          if(tempData.length > 0 && cashFlowData.length > 0){
            tempCompletion = ((tempData[tempData.length - 1].cumulativeActualCost /cashFlowData[cashFlowData.length - 1].cumulativePlanCost) * 100).toFixed(2);
          }
        }
        setCompletion(tempCompletion);

        if(props.manHours !== undefined){
            setManHours(props.manHours)
        }

	}, [cashFlowData, manHours, props])

    function process(date){
		var parts = date.split("-");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

    return(
        <>
            <Grid container alignItems="center" className={'justify-center mt-10 font-bold'} style={{padding:"10px"}}> 
                <Grid xs={6}>
                  <Gauge valueLabelStyle={{'fontSize':'20px'}} topLabelStyle={{'color':'#00000','fontSize':'14px'}}  value={completion} width={200} height={120} backgroundColor="#edebeb" color="rgb(0, 150, 255)" label='% Completion'/>   
                </Grid>
                <Grid xs={3}></Grid>
            </Grid>

            <Grid container  rowSpacing={1} alignItems="center" style={{"minHeight":"30px"}}>
                <Grid xs={6} style={{'backgroundColor':'#01F9C6'}} className={classes.cc}>
                   <Typography className= "font-bold text-center" style={{'fontSize':'11px','color':'black'}}>Safe Man Hours </Typography>
                </Grid>
                <Grid xs={6} style={{'backgroundColor':'#01F9C6'}} className={classes.cc}>
                   <Typography className= {clsx(classes.backdrop,"font-bold text-center")}  style={{'fontSize':'11px','color':'black'}}> {manHours} </Typography>
                </Grid>
            </Grid>

            {/* <Grid container  rowSpacing={1} alignItems="center" style={{"minHeight":"30px"}}>
                <Grid xs={6} style={{'backgroundColor':'#c7bad3'}} className={classes.cc}>
                   <Typography className= "font-bold text-center" style={{'fontSize':'11px','color':'black'}}>Planned Cost </Typography>
                </Grid>
                <Grid xs={6} style={{'backgroundColor':'#c7bad3'}} className={classes.cc}>
                   <Typography className= {clsx(classes.backdrop,"font-bold text-center")}  style={{'fontSize':'11px','color':'black'}}> Actual Cost </Typography>
                </Grid>
            </Grid>

            <Grid container rowSpacing={1} alignItems="center" style={{"minHeight":"30px"}}>
                <Grid xs={6}>
                 <Typography className={clsx(classes.numbers, 'text-center font-bold mt-4 ')}  style={{'fontSize':'12px','color':'black'}}> {planCost} </Typography>
                </Grid>
                <Grid xs={6}>
                 <Typography className={clsx(classes.numbers, 'text-center font-bold mt-4')}  style={{'fontSize':'12px','color':'black'}}> {actualCost} </Typography>
                </Grid>
            </Grid>
       
            <Grid  container alignItems="center" style={{"minHeight":"30px"}}>
                <Grid xs={6} className={classes.cc} style={{'backgroundColor':'#b3e19f'}}>
                   <Typography className= "font-bold text-center" style={{'fontSize':'11px','color':'black'}}> Cumulative Planned Cost </Typography>
                </Grid>
                <Grid xs={6} style={{'backgroundColor':'#b3e19f'}} className={classes.cc}>
                   <Typography className= {clsx(classes.backdrop,"font-bold text-center")}  style={{'fontSize':'11px','color':'black'}}> Cumulative Actual Cost </Typography>
                </Grid>
            </Grid>

            <Grid   container alignItems="center"  style={{"minHeight":"30px"}}>
                <Grid xs={6}>
                 <Typography className={clsx(classes.numbers, 'text-center font-bold mt-4 ')}  style={{'fontSize':'12px','color':'black'}}> {cumulativePlanCost} </Typography>
                </Grid>
                <Grid xs={6}>
                 <Typography className={clsx(classes.numbers, 'text-center font-bold mt-4')}  style={{'fontSize':'12px','color':'black'}}> {cumulativeActualCost} </Typography>
                </Grid>
            </Grid> */}
        </>
    )   

}


export default React.memo(PercentCompletion);