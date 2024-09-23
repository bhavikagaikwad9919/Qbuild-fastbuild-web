import React, { useEffect,useState,useRef } from 'react';
import ListItem from "@material-ui/core/ListItem";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Labor from './widgets/LaborBarGraph';
import Ncr from './widgets/NcrGraph';
import Ir from './widgets/IrGraph';
import Rfi from './widgets/RfiGraph';
import Safety from './widgets/SafetyNcrGraph';
import Gfc from './widgets/GfcGraph';
import PercentCompletion from './widgets/PercentCompletion';
import Manpower from './widgets/Manpower';
import { Dialog, DialogContent,Typography, Divider, Card, Grid, Fab, Icon, ListItemText, DialogActions, DialogTitle, Button } from "@material-ui/core";
import { getSSADashboard, getReportSummary } from 'app/main/projects/store/projectsSlice';
import { routes, getOrganization } from "../../store/organizationSlice";
import clsx from "clsx";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import BuildingStatusGraph from './widgets/BuildingStatusGraph';
import CashflowGraph from './widgets/CashflowGraph';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
        height: 48,
        padding: '15px 10px',
	    textAlign: 'center',
	    flex: 1,
	    width: 1000, 
	},
	words:{
		fontSize: '1rem',
		fontWeight: '200',
	},
	numbers:{
		padding: '15px 0px',
		textAlign: 'center',
		fontSize: '1.4rem',
		fontWeight: '700',
	},
	headline:{
		color: 'black',
		fontSize: '20px',
		fontWeight: '625',
		marginBottom: 10,
		//marginLeft: 300,
	},
	date:{
		color: 'blue',
		fontSize: '15px',
		fontWeight: '800',
	},
	days:{
		marginLeft: '7rem',
		fontSize: '1.4rem',
		fontWeight: '700',
	},
	content:{
		marginLeft: '2rem',
	},
	wrapper :{
		height: "100%",
		display: "flex",
	},
	contenty:{
		flex: '1',
        overflow: "auto",
	},
	border:{
		borderWidth:"0.4rem"
	},
	textStyle:{
        maxWidth: '100%',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: '1',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
	addButton: {
		display: "flex",
		position: "fixed",
		right: 40,
		bottom: 5,
		zIndex: 99,
		columnGap: "10px",
	  },
  }));

function SSADashboard(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const allProjects = useSelector(({ organizations }) => organizations.allProjects);
  const [viewOpen,setViewOpen] = useState(true);
  const details = useSelector(({ organizations }) => organizations.organization);
  const sites = useSelector( ({ organizations }) => organizations.sites);
  const [timeLine,setTimeLine] = useState({});
  const [milestones,setMilestones] = useState([]);
  const [irData, setIrData] = useState([]);
  const [rfiData, setRfiData] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [gfcData, setGfcData] = useState([]);
  const [qualityData, setQualityData] = useState([]);
  const [area, setArea] = useState([]);
  const [gfcCount, setGfcCount] = useState([0,0]);
  const [wayForward, setWayForward] = useState([]);
  const [lbData, setLbData] = useState([])
  const [laborData, setLaborData] = useState([])
  const [manHours, setManHours] = useState(0);
  const [manPower, setManPower] = useState(0);
  const [cumConcrete, setCumConcrete] = useState(0);
  const [periodConcrete, setPeriodConcrete] = useState(0);
  const [dailyConcrete, setDailyConcrete] = useState(0);
  const [cumLaborCount, setCumLaborCount] = useState(0);
  const [periodLaborCount, setPeriodLaborCount] = useState(0);
  const [dailyLaborCount, setDailyLaborCount] = useState(0);
  const [reportDate, setReportDate] = useState(new Date());
  const [pageLoading, setPageLoading] = useState(false);
  const [sitePhotos, setSitePhotos] = useState([]);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [cashFlow, setCashFlow] = useState([])
  const [completeDays, setCompleteDays] = useState(0)

  let today = new Date(), labl = [];

  useEffect(() => {
	dispatch(getOrganization({ OrganizationId : details._id })).then(
	)
	let tempImages = [];
    getStatus(reportDate);

	sites.forEach((site)=>{
		if(site.images !== undefined){
			let images = site.images, tempPhoto = [];
			if(images.length > 0){
				
				images.forEach((img)=>{
					if(process(moment(new Date(img.photoDate)).format('DD-MM-YYYY'))<= process(moment(new Date(reportDate)).format('DD-MM-YYYY'))){
                       tempPhoto.push(img)
					}
				})

				let imageLength = tempPhoto.length;
				if(imageLength > 0){
					tempImages.push({
						siteName : site.name,
						photo : tempPhoto[imageLength - 1].siteImage.url
					})
				}
			}
		}
	})
	setSitePhotos(tempImages);

	let day = 24 * 60 * 60 * 1000;
	let days = Math.round(Math.abs((process(moment(details.summary.revised_finish).format("DD-MM-YYYY")) - process(moment(reportDate).subtract(1, 'day').format("DD-MM-YYYY"))) / day))
    setCompleteDays(days)
  }, [reportDate]);

  async function getStatus(date){
    setPageLoading(true);

	let dashDate = moment(date).format('MM/DD/YYYY');
	await dispatch(getSSADashboard({ userId, orgId: details._id, dashDate })).then((response)=>{
		if(response.payload){
			setTimeLine(response.payload.summaryTimeline);
			setMilestones(response.payload.milestones);
			setIrData(response.payload.ir);
			setRfiData(response.payload.rfi);
			setSafetyData(response.payload.safety);
			setGfcData(response.payload.gfc);
			setQualityData(response.payload.quality);
			setArea(response.payload.area);
			setWayForward(response.payload.wayForward);
			setManHours(response.payload.safeManHours);
			setCashFlow(response.payload.cashFlow)

			if(response.payload.cumConcrete.length > 0){
				setCumConcrete(response.payload.cumConcrete[0].Concrete);
			}else{
				setCumConcrete(0)
			}
			
			if(response.payload.periodConcrete.length > 0){
				setPeriodConcrete(response.payload.periodConcrete[0].Concrete);
			}else{
				setPeriodConcrete(0)
			}

			if(response.payload.dailyConcrete.length > 0){
				setDailyConcrete(response.payload.dailyConcrete[0].Concrete);
			}else{
				setDailyConcrete(0)
			}

			if(response.payload.totalLabourCount.length > 0){
				setCumLaborCount(response.payload.totalLabourCount[0].totalCount);
			}else{
				setCumLaborCount(0)
			}
			  
			if(response.payload.monthlyLabourCount.length > 0){
				setPeriodLaborCount(response.payload.monthlyLabourCount[0].MonthlyCount);
			}else{
				setPeriodLaborCount(0)
			}
			  
			if(response.payload.dailyLabourCount.length > 0){
				setDailyLaborCount(response.payload.dailyLabourCount[0].LabourCount);
			}else{
				setDailyLaborCount(0)
			}
			
			if(response.payload.gfcDrawing.length > 0){
				setGfcCount([response.payload.gfcDrawing[0].receivedDrawings, response.payload.gfcDrawing[0].pendingDrawings]);
			}else{
				setGfcCount([0,0])
			}

			if(response.payload.graphData !== undefined){
				let tempLabel = [], tempCount = [];
				sites.forEach((site)=>{
					if(response.payload.graphData.length > 0){
						let i = 0;
						response.payload.graphData.forEach((gp, id)=>{
							if(gp.site === site.name){
								tempLabel.push(site.name);
								tempCount.push(gp.manPower);
								i++;
							}else if(i === 0 && id === (response.payload.graphData.length -1)){
								tempLabel.push(site.name);
								tempCount.push(0)
							}
						})
					}else{
						tempLabel.push(site.name);
						tempCount.push(0)
					}
				})
                
				setLbData({count: tempCount, label: tempLabel, manPower: 0});
				setLaborData(response.payload.graphData)
			}

		}
	});
	setPageLoading(false);
  }
  
  const handleDateChange = (prop) => (date) => {
    setReportDate(date);
	let day = 24 * 60 * 60 * 1000;
	let days = Math.round(Math.abs((process(moment(details.summary.revised_finish).format("DD-MM-YYYY")) - process(moment(date).subtract(1, 'day').format("DD-MM-YYYY"))) / day))
    setCompleteDays(days)
	getStatus(date);
	setShow(false);
  };

function process(date){
	var parts = date.split("-");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

function showPhotos(photo){
  setOpen(true)
  setTitle(photo.siteName);
  setFile(photo.photo)
}

  const exportPDF = async () =>{
	setPageLoading(true);
	const input = document.getElementById('SSADashboard')
	
	await html2canvas(input,{logging:true, letterRendering:1,allowTaint: false, useCORS:true}).then(canvas=>{
		const imgWidth=200;
		const imgHeight= canvas.height * imgWidth / canvas.width;
		const imgData = canvas.toDataURL('img/png');
		const pdf = new jsPDF('p', 'mm', 'a4');
		pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
		pdf.save('Dashboard.pdf');
	})

	setPageLoading(false);
  }

	return (
		<>
		  <Dialog  open={viewOpen} fullScreen>
		    <DialogContent className={"items-center justify-center"}>
		       <div fullScreen id='SSADashboard' style={{width:'100%'}}>
				    <Backdrop className={classes.backdrop} open={pageLoading}>
					  <CircularProgress color="inherit" />
				    </Backdrop>

				    <Card id="button2" className="sm:w-1" style={{  "borderWidth":"0.1rem", "borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"20px", 'backgroundColor':'#CCCCFF'}}>
				        <Grid container alignItems="center" className="flex flex-1 w-full mb-6 mt-10">
				            <Grid xs={1} className={"ml-10 mb-10"}>
								{show ===true? 
								    <MuiPickersUtilsProvider utils={DateFnsUtils}>
								        <DatePicker
									       required
									       label="Date"
									       className="w-3/4 h-full"
									       format="dd/MM/yyyy"
									       value={reportDate}
									       maxDate={today}
									       variant='contained'
									       onChange={handleDateChange("reportdate")}
								        />
							        </MuiPickersUtilsProvider>
								:
								    <Typography className='text-center font-bold' style={{"font-size": "1.8rem"}} onClick={()=> setShow(true)}> {moment(reportDate).format('DD/MM/YYYY')} </Typography>
								}
					        </Grid>
					        <Grid item xs={10} >
			    	        	<Typography className= {clsx(classes.headline, 'text-center')}> CIDCO PMAY Package III EXECUTIVE SUMMARY REPORT</Typography>
					        </Grid>
			  	        </Grid>
				    </Card>
				 
				    <div className="w-full" id="button2" > 
				        <div className="flex flex-col sm:flex sm:flex-row" style={{'width':'100%','height':'100%'}}>
				     	    
							<Card id="button2" className= "shadow-1 sm:w-1/3" style={{"height":"200px","borderWidth":"0.4rem", "borderColor":"#D3D3D3","borderBottom":"none", "borderRight":"none", "borderRadius":"20px", marginBottom:'10px', "marginTop":"10px", "marginRight":"10px", backgroundColor:"#ffeadd"}}>
								<Grid container alignItems="center" style={{backgroundColor:"#ffeadd" }}  className={'mt-10 mb-10'}>
						            <Grid xs={7} >
						             <Typography  className= "font-bold text-center"> Summary Timeline</Typography>
						            </Grid>
					    	        <Grid xs={5}>
						              <Typography  className="font-bold text-center"> Date/Days </Typography>	
						            </Grid>
						        </Grid>
								<Divider />
							    <Grid container alignItems="center">
                                    <Grid xs={7}>
                                      <Typography className={'text-center'}> Contractual Finish </Typography>
                                    </Grid>
                                    <Grid xs={5}>
                                     <Typography className={'text-center'}> {timeLine.contractualFinish} </Typography>
                                    </Grid>
                                </Grid>
								<Grid container alignItems="center">
                                    <Grid xs={7}>
                                      <Typography className={'text-center'}> Contractual Start </Typography>
                                    </Grid>
                                    <Grid xs={5}>
                                     <Typography className={'text-center'}> {timeLine.contractualStart} </Typography>
                                    </Grid>
                                </Grid>
								<Grid container alignItems="center">
                                    <Grid xs={7}>
                                      <Typography className={'text-center'}> {timeLine.finishTitle} </Typography>
                                    </Grid>
                                    <Grid xs={5}>
                                     <Typography className={'text-center'}> {timeLine.revisedFinish} </Typography>
                                    </Grid>
                                </Grid>
								<Grid container alignItems="center">
                                    <Grid xs={7}>
                                      <Typography className={'text-center'}> {timeLine.startTitle} </Typography>
                                    </Grid>
                                    <Grid xs={5}>
                                     <Typography className={'text-center'}> {timeLine.revisedStart} </Typography>
                                    </Grid>
                                </Grid>
								<Grid container alignItems="center">
                                    <Grid xs={7}>
                                      <Typography className={'text-center font-bold'}> Time Lapased in Days </Typography>
                                    </Grid>
                                    <Grid xs={5}>
                                     <Typography className={'text-center font-bold'}> {timeLine.timeLapsed} </Typography>
                                    </Grid>
                                </Grid>
								<Grid container alignItems="center">
                                    <Grid xs={7}>
                                      <Typography className={'text-center font-bold'}> Time to Complete in Days </Typography>
                                    </Grid>
                                    <Grid xs={5}>
                                     <Typography className={'text-center font-bold'}> {completeDays} </Typography>
                                    </Grid>
                                </Grid>        
		                    </Card>

							<Card id="button2" className="shadow-1 sm:w-1/3" style={{"height":"200px","borderWidth":"0.4rem","borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"20px", marginRight:'10px', marginBottom:'10px', marginTop:'10px', "backgroundColor":"#ffeadd"}} >
						      <PercentCompletion reportDate={reportDate} manHours={manHours}/>
				            </Card>
						
							<Card id="button2" className="shadow-1 sm:w-1/3" style={{"height":"200px","borderWidth":"0.4rem","borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"20px", "marginBottom":"10px", "marginTop":"10px", "marginRight":"10px", backgroundColor:"#ffeadd"}} >
						      <Manpower manCount={manPower} totalConcrete ={cumConcrete} concrete={periodConcrete} dailyConcrete={dailyConcrete} totalLaborCount ={cumLaborCount} laborCount={periodLaborCount} dailyLaborCount={dailyLaborCount}  />
				            </Card>

							<Card id="button2" className="shadow-1 sm:w-1/3" style={{"height":"200px","borderWidth":"0.4rem", "borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"20px", "paddingBottom":"10px", "paddingLeft":"20px", "marginBottom":"10px", "marginTop":"10px",backgroundColor:"#ffeadd"}} >
						      <Ir data={irData} />
				            </Card> 
			           	</div>

					    <div className="flex flex-col sm:flex sm:flex-row" style={{'width':'100%', 'height':'100%'}}>
							<Card id="button2" className="shadow-1 sm:w-1/3" style={{"borderWidth":"0.4rem", "minHeight":"270px", "borderColor":"#D3D3D3","borderBottom":"none", "borderRight":"none", "borderRadius":"20px",  "marginRight":"10px" , "marginBottom":"10px",  "backgroundColor":"#B1FFFF"}} >
						     <CashflowGraph reportDate={reportDate} data={cashFlow}/>
				            </Card>	

							<Card id="button2" className="shadow-1 sm:w-1/3" style={{  "borderWidth":"0.4rem", "borderColor":"#D3D3D3","borderBottom":"none", "borderRight":"none", "borderRadius":"20px", "marginBottom":"10px", "marginRight":"10px", backgroundColor:"#B1FFFF"}} >
						      <Labor data={lbData} labors={laborData}/>							  
				            </Card>

							<Card id="button2" className="shadow-1 sm:w-1/3" style={{"borderWidth":"0.4rem", "minHeight":"270px", "borderColor":"#D3D3D3","borderBottom":"none", "borderRight":"none", "borderRadius":"20px", "marginRight":"10px" , "marginBottom":"10px", "backgroundColor":"#B1FFFF"}} >
						      <BuildingStatusGraph date={reportDate} />
				            </Card>

					    </div>

					    <div className="flex flex-col sm:flex sm:flex-row" style={{'width':'100%', 'height':'100%'}} >
					        <Card id="button2" className="shadow-1 sm:w-1/4" style={{"borderWidth":"0.4rem", "borderColor":"#D3D3D3", "borderRight":"none", "borderRadius":"20px","paddingBottom":"10px", "paddingLeft":"10px",  "marginRight":"10px" ,backgroundColor:"#F7F4C7"}} >
						      <Gfc data={gfcCount}/>
				            </Card>	

							<Card id="button2" className="shadow-1 sm:w-1/4" style={{"borderWidth":"0.4rem", "borderColor":"#D3D3D3", "borderRight":"none", "borderRadius":"20px","paddingBottom":"10px","paddingLeft":"10px", "marginRight":"10px", backgroundColor:"#F7F4C7"}} >
						     <Rfi data={rfiData} />
				            </Card>	

						    <Card id="button2" className="shadow-1 sm:w-1/4" style={{"borderWidth":"0.4rem", "borderColor":"#D3D3D3", "borderRight":"none", "borderRadius":"20px", "paddingBottom":"10px","paddingLeft":"10px", "marginRight":"10px", backgroundColor:"#F7F4C7"}} >
						     <Ncr data={qualityData}/>
				            </Card>

							<Card id="button2" className="shadow-1 sm:w-1/4 " style={{"borderWidth":"0.4rem", "borderColor":"#D3D3D3", "borderRadius":"20px", "paddingLeft":"10px", "marginRight":"10px", backgroundColor:"#F7F4C7"}} >
						      <Safety data={safetyData} />
				            </Card>
						   
			            </div>

						<div className="flex flex-col sm:flex sm:flex-row" style={{'width':'100%', 'height':'100%', "paddingTop":"10px"}}>
						    {sitePhotos.map((sitep)=>(	
						        <Card id="button2" className="shadow-1 sm:w-1/4" style={{'backgroundColor':'#F0F8FF', 'minWidth':'270px',"padding":"10px"}}  >
							        <Typography 
									   className="font-bold text-center mb-10 mt-10 cursor-pointer"
									   onClick={()=> showPhotos(sitep)}
									   style={{"color": "#5252df"}}
									>
										{sitep.siteName}
									</Typography> 
							        <img src={sitep.photo + '?time=' + new Date().valueOf()} crossOrigin="" height="100%" width="100%" style={{"borderRadius":"20px",'maxHeight':'200px' }} />	
						        </Card>						
							))}  
						</div>

						<div id="button2" className="flex flex-col sm:flex sm:flex-row" >
                            <Card id="button2" className="shadow-1 sm:w-1/3" style={{"height":"150px","borderTop":"none", "borderRight":"none", "borderWidth":"0.4rem", "borderColor":"#D3D3D3", "borderRadius":"20px", "marginRight":"10px", 'backgroundColor':'#E5FFFF', 'position':'overflow', maxHeight:'150px', overflowY:'auto',width:'100%', height:'100%',marginTop:'10px'}}>
							    <Typography className= "font-bold text-center mb-10 mt-10">Milestones</Typography>
						        {milestones.map((ml)=>(
									<ListItem>
										<ListItemText
										  style={{ color: "#2C5CE8","fontWeight":"500" }}
                                          primary={ml}
							            />
									</ListItem>
						        ))}	 
		                    </Card>

							<Card id="button2" className="shadow-1 sm:w-1/3" style={{ "height":"150px","borderWidth":"0.4rem", "borderTop":"none", "borderRight":"none", "borderColor":"#D3D3D3","borderRadius":"20px","marginRight":"10px",'backgroundColor':'#E5FFFF','position':'overflow', maxHeight:'150px', overflowY:'auto',width:'100%', height:'100%',marginTop:'10px'}}>
						       <Typography className="font-bold text-center mb-10 mt-10">Area of Concern</Typography>
						       {area.map((ar)=>(
								    <ListItem>
								        <ListItemText
								           style={{ color: "#2C5CE8","fontWeight":"500" }}
								           primary={ar}
								        />
							        </ListItem>
						        ))}
		                    </Card>

							<Card id="button2" className="shadow-1 sm:w-1/3" style={{"height":"150px","borderWidth":"0.4rem","borderWidth":"0.4rem" ,"borderTop":"none", "borderColor":"#D3D3D3", "borderRadius":"20px", 'backgroundColor':'#f2f2f2', "marginRight":"10px", 'backgroundColor':'#E5FFFF','position':'overflow', maxHeight:'150px', overflowY:'auto',width:'100%', height:'100%',marginTop:'10px'}}>	
						        <Typography className= "font-bold text-center mb-10 mt-10">Way Forward</Typography>
						        {wayForward.map((wf)=>(
									<ListItem>
									    <ListItemText
									       style={{ color: "#2C5CE8","fontWeight":"500" }}
									       primary={wf}
									    />
								    </ListItem>
						        ))}
		                    </Card>
						</div>
				    </div>
			    </div>
	    	</DialogContent>

            <div className={clsx(classes.addButton)} id="button1">
               <style>
				  {`@media print
			        {
						#button2 {-webkit-print-color-adjust: exact;}
						@page {
							size: 1700px 1400px;
							-webkit-print-color-adjust: exact !important;
						}
						
						#button1{
							display: none;
						}
				    }`
				  }
				</style>
               <Fab color="primary" aria-label="print">
                   <Icon onClick={() => exportPDF() }>
                      <PictureAsPdfIcon />
                   </Icon>
               </Fab>
               <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Fab 
				        color="primary"
					    aria-label="close"
					    onClick={() => {
						   setViewOpen(false)
                           dispatch(routes("Projects"))
                        }}
                    >
                        <Icon>close</Icon>
                    </Fab>
               </FuseAnimate>
            </div>
		  </Dialog>

          <Dialog fullWidth open={open}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle> 
            <DialogContent className="items-center justify-center">
                <div>
				    <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
				      <img alt="viewFile" src={file} />  
				    </PrismaZoom>
                </div> 
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={() =>{
                      setOpen(false)
                      setFile('')
                      setTitle('')
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

export default SSADashboard;
