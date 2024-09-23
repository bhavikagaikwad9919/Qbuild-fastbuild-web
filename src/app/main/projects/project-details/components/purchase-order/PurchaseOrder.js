import React, { useState, useEffect } from "react";
import { makeStyles, withStyles, } from "@material-ui/core/styles";
import { Fab, Icon, Button, } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import PurchaseOrderDialog from "./PurchaseOrderDialog";
import { Backdrop } from "@material-ui/core";
import {
  downloadPO,
  openNewDialog,
  openEditDialog,
  detailPurchaseOrder,
  viewPO,
  listPurchaseOrders
} from "app/main/projects/store/projectsSlice";
import Typography from "@material-ui/core/Typography";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import moment from 'moment';
import ViewPo from "./ViewPo"

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  root: {
    maxHeight: "68vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
  table: {
    minWidth: 500,
  },
}));

function PurchaseOrder(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const purchaseOrders = useSelector(({ projects }) => projects.purchaseOrders.purchaseOrderList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const [access, setAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const [po, setPO] = useState([]);
  const [poId, setPoId] = useState('');
  const [poOrderNo, setPoOrderNo] = useState()
  const [viewOpen, setViewOpen] = useState(false);
  const [downloadAccess, setDownloadAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const [viewAccess, setViewAccess] = useState();


  useEffect(() => {
    team.forEach((t) => {
      if ((t._id === role.data.id && t.role === "owner") || role.role === 'admin') {
        setDownloadAccess(true);
        setCreateAccess(true);
        setViewAccess(true);
      } else if (t._id === role.data.id && t.role !== "owner") {
        const member = t.tab_access.filter((i) => i === "Purchase Order");
        setCreateAccess(t.tab_access.includes("Purchase Order") || t.tab_access.includes("Create/Update Purchase Order"));
        setViewAccess(t.tab_access.includes("Purchase Order") || t.tab_access.includes("View Purchase Order"));
        setDownloadAccess(t.tab_access.includes("Purchase Order") || t.tab_access.includes("Download Purchase Order"));

        if (member[0] === "Purchase Order") {
        }
      }
    })
  }, [role.data.id, role.role, team]);

  useEffect(() => {
    dispatch(listPurchaseOrders(projectId));
  }, [dispatch, projectId]);

  if (!purchaseOrders) {
    return <FuseLoading />;
  }

  let pos = [];
  let id = '';
  let orderNo = '';
  let orderDate = '';
  let quotationDate = '';
  let supplier = '';
  let status = ''
  let today = new Date()
  let DateSelected = moment(today).format("DD/MM/YYYY");

  purchaseOrders.forEach((element) => {
    let year = moment(element.createdDate).format('YYYY');

    id = element.id;
    orderNo = `${projectName}/${element.orderId}/${year}`;
    orderDate = element.orderDate;
    quotationDate = element.quotationDate;
    supplier = element.supplier;
    if (process(element.expiryDate) < process(DateSelected)) {
      status = 'Expired'
    } else {
      status = 'Active'
    }

    pos.push({ id, orderNo, orderDate, quotationDate, supplier, status });
  });

  const downloadPOReport = (purchaseOrderDetails) => {
    let purchaseId = purchaseOrderDetails.id;
    let orderNo = purchaseOrderDetails.orderNo;
    dispatch(downloadPO({ projectId, projectName, purchaseId, orderNo, })).then((response) => {

    });
  }

  const viewPOReport = (purchaseOrderDetails) => {
    setPoId(purchaseOrderDetails.id);
    setPoOrderNo(purchaseOrderDetails.orderNo);
    let purchaseId = purchaseOrderDetails.id;
    let orderNo = purchaseOrderDetails.orderNo;
    dispatch(viewPO({ projectId, projectName, purchaseId, orderNo, })).then((response) => {
      setPO(response.payload);
      setViewOpen(true);
    });
  }

  const openDialog = (data) => {
    let purchaseId = data.id;
    dispatch(detailPurchaseOrder({ purchaseId })).then((response) => {
      dispatch(openEditDialog(data));
    });
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if (id === 'status') {
      return (
        row[id] !== undefined ?
          String(row[id].props.children.toLowerCase()).includes(filter.value.toLowerCase())
          :
          false
      );
    } else {
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
          :
          false
      );
    }
  }

  function process(date) {
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  function handleClose() {
    setViewOpen(false);
    setPoId('');
    setPO([])
    setPoOrderNo('')
  }

  function formatOrderNumber(orderNo) {
    const orderSegments = orderNo.split('/');
    const formattedOrderNo = (orderSegments.length >= 2) ? orderSegments.slice(-2).join('/') : "";
    return formattedOrderNo;
  }


  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Purchase Order</Typography>
          {createAccess ?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{ padding: '3px 16px' }} nowrap="true">Add PO</Button>
            : null}
        </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            // className={clsx(classes.root)}
            data={pos}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
            // pageSize={team.length}
            columns={[
              {
                Header: "Order No",
                style: { 'white-space': 'unset' },
                accessor: "orderNo",
                filterable: true,
                Cell: ({ row }) => (

                  <a
                      className="cursor-pointer text-wrap"
                      onClick={createAccess ? () => {
                        openDialog(row._original)
                      } : () => dispatchWarningMessage(dispatch, "You don't have access to view or update purchase order.")}
                    >
                      {/* {row.original && row.original.orderNo ? formatOrderNumber(row.original.orderNo) : 'N/A'} */}
                      {row.orderNo ? formatOrderNumber(row.orderNo) : 'N/A'}
                    </a>
                  
                  
                ),
                className: "font-bold",
              },
              {
                Header: "Order Date",
                accessor: "orderDate",
                filterable: true,
                style: { 'textAlign': 'center', 'white-space': 'unset' },
              },
              // {
              //   Header: "Quotation",
              //   accessor: "quotation",
              //   className: "justify-center",
              // },
              {
                Header: "Quotation Date",
                accessor: "quotationDate",
                filterable: true,
                className: "justify-center",
                style: { 'textAlign': 'center' },
              },
              {
                Header: "Supplier",
                accessor: "supplier",
                filterable: true,
                style: { 'textAlign': 'center', 'white-space': 'unset' },
              },
              {
                Header: 'Status',
                filterable: true,
                style: { textAlign: "center", 'white-space': 'unset' },
                id: 'status',
                width: 100,
                accessor: (d) => (
                  <Typography
                    className={
                      d.status === 'Submitted'
                        ? 'bg-yellow-700 text-white inline p-4 rounded truncate'
                        : d.status === 'Active'
                          ? 'bg-green-700 text-white inline p-4 rounded truncate'
                          : d.status === 'New'
                            ? 'bg-blue  -700 text-white inline p-4 rounded truncate'
                            : d.status === 'Expired'
                              ? 'bg-red  -700 text-white inline p-4 rounded truncate'
                              : 'bg-purple-700 text-white inline p-4 rounded truncate '
                    }
                  >
                    {d.status}
                  </Typography>
                ),
                className: 'font-bold',
              },
              {
                Header: 'Download PO / View PO',
                id: 'download_po',
                style: { 'textAlign': 'center', 'white-space': 'unset' },
                accessor: "downloadPO",
                Cell: ({ row }) => (
                  <>
                    <a
                      className="cursor-pointer"
                      onClick={ downloadAccess ? () => {
                        downloadPOReport(row._original)
                      } : () => dispatchWarningMessage(dispatch, "You don't have access to download PO.")}
                    >
                      Download
                    </a>
                    <span> / </span>
                    <a
                      className="cursor-pointer"
                      onClick={ viewAccess ? () => {
                        viewPOReport(row._original)
                      } : () => dispatchWarningMessage(dispatch, "You don't have access to view PO.")}
                    >
                      View
                    </a>
                  </>
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={10}
            noDataText="No Purchase Order Found"
          />
        </FuseAnimate>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.addButton}
            disabled={createAccess === true ? false : true}
            onClick={() => {
              dispatch(openNewDialog())
            }}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>

      </Paper>

      <PurchaseOrderDialog />
      
      {viewOpen ? <ViewPo open={viewOpen} data={po} orderNo={poOrderNo} poId={poId} close={() => handleClose()} /> : null}

    </React.Fragment>
  );
}

export default PurchaseOrder;