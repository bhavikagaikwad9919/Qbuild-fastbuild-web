import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { addRepairHistory } from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";

const RepairHistoryDialog = (props) => {
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    year: "",
    notes: "",
    slabRecasting: "",
    columnJacketing: "",
    structuralRepairs: "",
    tenantableRepairs: "",
    roofWaterproofing: "",
    plumbing: "",
    additionalAlterations: "",
  });
  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const disableButton = () => {
    return value.year.length > 0;
  };

  const handleSubmit = () => {
    setLoading(true);
    dispatch(addRepairHistory({ projectId, form: value })).then(() => {
      setLoading(false);
      props.save(value);
      setOpen(false);
      props.close();
    });
  };
  return (
    <>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle>Add Repair History</DialogTitle>
        <DialogContent>
          <div className="flex flex-1 flex-col w-full gap-10">
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Year"
                type="number"
                value={value.year}
                onChange={(event) =>
                  setValue({ ...value, year: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Notes"
                value={value.notes}
                onChange={(event) =>
                  setValue({ ...value, notes: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Slab Recasting"
                value={value.slabRecasting}
                onChange={(event) =>
                  setValue({ ...value, slabRecasting: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Column Jacketing"
                value={value.columnJacketing}
                onChange={(event) =>
                  setValue({ ...value, columnJacketing: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Structural Repairs"
                value={value.structuralRepairs}
                onChange={(event) =>
                  setValue({ ...value, structuralRepairs: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Tenantable Repairs"
                value={value.tenantableRepairs}
                onChange={(event) =>
                  setValue({ ...value, tenantableRepairs: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Roof Waterproofing"
                value={value.roofWaterproofing}
                onChange={(event) =>
                  setValue({ ...value, roofWaterproofing: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Plumbing"
                value={value.plumbing}
                onChange={(event) =>
                  setValue({ ...value, plumbing: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Additional Alterations"
                value={value.additionalAlterations}
                onChange={(event) =>
                  setValue({
                    ...value,
                    additionalAlterations: event.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-10">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Button
                  disabled={!disableButton()}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Add
                </Button>
              )}

              <Button variant="contained" color="primary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RepairHistoryDialog;
