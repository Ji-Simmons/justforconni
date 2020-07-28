import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FlightIcon from '@material-ui/icons/Flight';
import WorkIcon from '@material-ui/icons/Work';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import GroupIcon from '@material-ui/icons/Group';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import "../App.css";

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function ModalMenu() {
  const [anchorEl, setAnchorEl] = React.useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget.value);
  };

  const handleClose = () => {
    //setAnchorEl(null);
    
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        id="category"
        onClick={((e) => handleClick(e.target.primary))}
      >
        Choose Event Category
      </Button>
      <StyledMenu
        style={{ zIndex: 1500 }}
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleClose}>
          <NotificationImportantIcon >
            <NotificationImportantIcon fontSize="small" />
          </NotificationImportantIcon>
          <ListItemText primary="Reminder" />
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClose}>
          <PriorityHighIcon>
            <DraftsIcon fontSize="small" />
          </PriorityHighIcon>
          <ListItemText primary="Appointment" />
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClose}>
          <GroupIcon>
            <InboxIcon fontSize="small" />
          </GroupIcon>
          <ListItemText primary="Meeting" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <SentimentSatisfiedAltIcon>
            <InboxIcon fontSize="small" />
          </SentimentSatisfiedAltIcon>
          <ListItemText primary="Personal" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <WorkIcon>
            <InboxIcon fontSize="small" />
          </WorkIcon>
          <ListItemText primary="Work" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <FlightIcon>
            <InboxIcon fontSize="small" />
          </FlightIcon>
          <ListItemText primary="Travel" />
        </StyledMenuItem>
      </StyledMenu>
      
    </div>
  );
}
