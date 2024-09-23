import { Avatar, ListItem, Typography } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
//import _ from "@lodash";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  observationItem: {
    borderBottom: `1px solid  ${theme.palette.divider}`,
  },
  avatar: {
    backgroundColor: theme.palette.primary[500],
  },
}));

const ObservationListItem = (props) => {
  const classes = useStyles();
  return (
    <ListItem
      dense
      button
      // onClick={() =>
      //   props.history.push(
      //     toPath({
      //       ...routeParams,
      //       mailId: props.mail.id,
      //     })
      //   )
      // }
      className={clsx(
        classes.observationItem,
        // checked && "selected",
        // !props.mail.read && "unread",
        "py-16 px-8"
      )}
    >
      {/* <Checkbox
          tabIndex={-1}
          disableRipple
          checked={checked}
          onChange={() => dispatch(toggleInSelectedMails(props.mail.id))}
          onClick={(ev) => ev.stopPropagation()}
        /> */}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        <div className="flex items-center justify-between px-16 pb-8">
          <div className="flex items-center">
            {props.observ.observedBy.profilePicture ? (
              <Avatar
                alt={props.observ.observedBy.name}
                src={props.observ.observedBy.profilePicture}
              />
            ) : (
              <Avatar className={classes.avatar}>
                {props.observ.observedBy.name}
              </Avatar>
            )}
            <Typography variant="subtitle1" className="mx-8">
              {props.observ.title}
            </Typography>
          </div>
          <Typography variant="subtitle1">
            {moment(props.observ.observedDate).format("DD-MM-YYYY, hh:mm A")}
          </Typography>
        </div>

        <div className="flex flex-col px-16 py-0">
          <Typography color="textSecondary" className="truncate">
            {"by " + props.observ.observedBy.name}
          </Typography>
        </div>

        {/* <div className="flex justify-end px-12">
            {!_.isEmpty(labels) &&
              props.mail.labels.map((label) => (
                <MailChip
                  className="mx-2 mt-4"
                  title={labels[label].title}
                  color={labels[label].color}
                  key={label}
                />
              ))}
          </div> */}
      </div>
    </ListItem>
  );
};

export default ObservationListItem;
