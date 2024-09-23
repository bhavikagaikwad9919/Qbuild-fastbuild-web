import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
//import GaugeChart from 'react-gauge-chart';
import Gauge from "react-svg-gauge";
import { Typography,Divider, Grid} from '@material-ui/core';
import clsx from "clsx";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector } from "react-redux";

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
        marginTop: '20px',
	},
    numbers:{
		padding: '0px 0px',
		textAlign: 'center',
		fontSize: '1.4rem',
		fontWeight: '700',
	}
}))

function Manpower(props){

    const chartData = [10.76, 89.24];
    const showData = chartData[0] / chartData[1];
    const classes = useStyles(props);
    const [periodConcrete, setPeriodConcrete] = useState(0);
    const [cumConcrete, setCumConcrete] = useState(0);
    const [dailyConcrete, setDailyConcrete] = useState(0);  
    const [cumLaborCount, setCumLaborCount] = useState(0);
    const [periodLaborCount, setPeriodLaborCount] = useState(0);
    const [dailyLaborCount, setDailyLaborCount] = useState(0);
    const [manPower, setManPower] = useState(0);
    const [manHours, setManHours] = useState(0);
    const cashFlowData = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);
    const details = useSelector(({ organizations }) => organizations.organization);

    useEffect(()=>{

        if(props.totalConcrete !== undefined){
            setCumConcrete(props.totalConcrete)
        }

        if(props.concrete !== undefined){
            setPeriodConcrete(props.concrete)
        }

        if(props.manCount !== undefined){
            setManPower(props.manCount)
        }

        if(details.safeManHours !== undefined){
            setManHours(details.safeManHours);
        }

        if(props.dailyConcrete !== undefined){
            setDailyConcrete(props.dailyConcrete)
        }

        if(props.totalLaborCount !== undefined){
            setCumLaborCount(props.totalLaborCount)
        }
          
        if(props.laborCount !== undefined){
            setPeriodLaborCount(props.laborCount)
        }
          
        if(props.dailyLaborCount !== undefined){
            setDailyLaborCount(props.dailyLaborCount)
        }
    }, [props, cashFlowData])

    return(
        <>
            <Grid container  spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="center" style={{"minHeight":"30px"}}>
                <Grid xs={3} className='p-20 mt-20' style={{'backgroundColor':'#c7bad3'}} >
                  
                </Grid>
                <Grid xs={3} className='p-10 mt-20' style={{'backgroundColor':'#c7bad3'}} >
                   <Typography className= "font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> Daily </Typography>
                </Grid>
                <Grid xs={3} className='p-10 mt-20' style={{'backgroundColor':'#c7bad3'}} >
                   <Typography className= "font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> Monthly </Typography>
                </Grid>
                <Grid xs={3} className='p-10 mt-20 mr-5' style={{'backgroundColor':'#c7bad3'}} >
                   <Typography className= "font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> Cumulative </Typography>
                </Grid>
            </Grid>

            <Grid container  spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="center" style={{"minHeight":"30px"}}>
                <Grid className='p-10 mt-10' xs={3} style={{'backgroundColor':'#b3e19f'}}>
                 <Typography  className='text-center font-bold '  style={{'fontSize':'12px', 'color':'black'}}> Man Power </Typography>
                </Grid>
                <Grid className='p-10 mt-10' style={{'backgroundColor':'#b3e19f'}} xs={3}>
                 <Typography className= 'text-center font-bold '  style={{'fontSize':'12px','color':'black'}}> {dailyLaborCount} </Typography>
                </Grid>
                <Grid className='p-10 mt-10' style={{'backgroundColor':'#b3e19f'}} xs={3}  >
                   <Typography className= "font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> {periodLaborCount} </Typography>
                </Grid>
                <Grid xs={3} className='p-10 mt-10' style={{'backgroundColor':'#b3e19f'}}  >
                   <Typography className= "font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> {cumLaborCount} </Typography>
                </Grid>
            </Grid>
       
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="center" style={{"minHeight":"30px"}}>
                <Grid xs={3} style={{'backgroundColor':'#EEA6A6'}} className='p-10 mt-10'   >
                   <Typography className= "font-bold text-center" style={{'fontSize':'12px','color':'black'}}>  Concrete (cum) </Typography>
                </Grid>
                <Grid xs={3} className='p-10 mt-10' style={{'backgroundColor':'#EEA6A6'}} >
                   <Typography className= {clsx(classes.backdrop,"font-bold text-center")}  style={{'fontSize':'12px','color':'black'}}> {dailyConcrete} </Typography>
                </Grid>
                <Grid xs={3} className='p-10 mt-10' style={{'backgroundColor':'#EEA6A6'}} >
                   <Typography className= "font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> {periodConcrete} </Typography>
                </Grid>
                <Grid xs={3} className='p-10 mt-10' style={{'backgroundColor':'#EEA6A6'}}>
                   <Typography className="font-bold text-center"  style={{'fontSize':'12px', 'color':'black'}}> {cumConcrete} </Typography>
                </Grid>
            </Grid>
        </>
    )   

}


export default React.memo(Manpower);