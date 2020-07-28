import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import axios from 'axios';
import ModalMenu from "./ModalMenu";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import TimePicker from "material-ui/TimePicker";
import "../App.css";
require("react-big-calendar/lib/css/react-big-calendar.css");


BigCalendar.momentLocalizer(moment);

export default class Calendar extends Component {
  
  constructor() {
    super();
    this.state = {
      events: [],
      category: "",
      title: "",
      start: "",
      end: "",
      desc: "",
      openSlot: false,
      openEvent: false,
      eventList: "",
      editForm: "",
      clickedEvent: {}
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount(){
        this.getEvents();
  }

  // getCachedEvents(){
  //   const cachedEvents = localStorage.getItem("cachedEvents");
  //   console.log("Cached Events", JSON.parse(cachedEvents));
  //   if(cachedEvents){
  //       this.setState({events: JSON.parse(cachedEvents)})
  //   }
  //   return;
  // }

  getEvents = () => {
    //axios
    fetch('http://localhost:5656/api/events')
    //.get("http://localhost:5656/api/events")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data from api: ", data);
        this.setState({
          events: data   
        })})
      .catch(error => console.log(error))   
  }

  //closes modals
  handleClose = () => {
    this.setState({ openEvent: false, openSlot: false })
  }

  //  Allows user to click on calendar slot and handles if appointment exists
  handleSlotSelected = (slotInfo) => {
    console.log("Real slotInfo", slotInfo);
    this.setState({
      category: "",
      title: "",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true
    });
  }

  handleEventSelected = (event) => {
    console.log("event", event);
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
      category: event.category
    });
  }

  setCategory = (e) => {
    this.setState({ category: e });
  }

  setTitle(e) {
    this.setState({ title: e });
  }

  setDescription(e) {
    this.setState({ desc: e });
  }

  handleStartTime = (event, date) => {
    this.setState({ start: date });
  };

  handleEndTime = (event, date) => {
    this.setState({ end: date });
  };

  // Onclick callback function that pushes new appointment into events array.
  setNewAppointment(event) {
    const { start, category, end, title, desc } = this.state;
    let appointment = { title, category, start, end, desc };
    let events = this.state.events.slice();
    events.push(appointment);
   
        // and some other stuff
		let route = `http://localhost:5656/api/events`;
		//let route = `https://helio-calendar-api.herokuapp.com/api/events`;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state),
        };
        fetch(route, options)
        .then((res) => { return res.json()})
        .then((data) =>
        {
            console.log('should have added a new event: ', data);
            this.context.getEvent();
        })
        .catch((err) =>
        {
            console.log('might not have added a new event: ', err);
        })
	};
  

  //  Updates Existing Appointments Title and/or Description
  updateEvent = (event) => {
    const { title, category, desc, start, end, events, clickedEvent } = this.state;
    const index = events.findIndex(event => event === clickedEvent);
    const updatedEvent = events.slice();
    updatedEvent[index].category = category;
    updatedEvent[index].title = title;
    updatedEvent[index].desc = desc;
    updatedEvent[index].start = start;
    updatedEvent[index].end = end;
    event.preventDefault();
		console.log('first state: ', this.state);
		// and some other stuff
		let route = 'http://localhost:5656/api/events';
		//let route = 'https://helio-calendar-api.herokuapp.com/api/events';
		// we need the _id in state to make stuff work but we don't actually want to submit it
		let submitData = { ...this.state };
		delete submitData._id;
		let fetchOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(submitData)
		};
		if (this.state._id !== 'new') {
			fetchOptions.method = 'PUT';
			route += `/${this.state._id}`;
		}
		// send all of the state data to the update list api endpoint
		console.log('state: ', this.state);
		console.log('route: ', route);
		console.log('fetchOptions: ', fetchOptions);
		fetch(route, fetchOptions)
			.then((data) => {
				return data.json();
			})
			.then((result) => {
				// call get lists again to update my app
				console.log('result: ', result);
				this.context.getEvents();
			})
			.catch((err) => {
				console.log('Error updating/creating event: ', err);
			});
  }

  //  filters out specific event that is to be deleted and set that variable to state
  deleteEvent = (e, event) => {
    e.preventDefault();
    let updatedEvents = this.state.events.filter(
      event => event["start"] !== this.state.start
    );
    console.log('deleting...');
		
		let id = this.state.clickedEvent._id
		console.log('id: ', id);
		let fetchOptions = {
			method: 'DELETE'
		};
		fetch(`http://localhost:5656/api/events/${id}`, fetchOptions)
		//fetch(`https://helio-calendar-api.herokuapp.com/api/lists/${id}`, fetchOptions)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log('response from api: ', data);
        this.getEvents();
        this.handleClose();
			})
			.catch();
  };
  

  render() {
    
    console.log("render()");
    const eventActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onClick={(e) => {
        //  this.deleteEvent(), this.handleClose();
        this.deleteEvent(e)
        }}
      />,
      <FlatButton
        label="Confirm Edit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.updateEvent(), this.handleClose();
        }}
      />
    ];
    const appointmentActions = [
      <FlatButton label="Cancel" secondary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.setNewAppointment(), this.handleClose();
        }}
      />
    ];
    return (
      <div id="Calendar">
        {/* react-big-calendar library utilized to render calendar*/}
        <BigCalendar
          events={this.state.events}
          views={["month", "week", "day", "agenda"]}
          timeslots={2}
          defaultView="month"
          defaultDate={new Date()}
          selectable={true}
          onSelectEvent={event => this.handleEventSelected(event)}
          onSelectSlot={slotInfo => this.handleSlotSelected(slotInfo)}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog
          
          title={`Book an appointment on ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={appointmentActions}
          modal={false}
          open={this.state.openSlot}
          onRequestClose={this.handleClose}
        >
          
          <div>

     <ModalMenu 
        onChange={e => {
          this.setCategory(e.target.value);
        }}
     />
      
    </div>
            <br />
          <TextField
            floatingLabelText="Title"
            onChange={e => {
              this.setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            onChange={e => {
              this.setDescription(e.target.value);
            }}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="Start Time"
            minutesStep={1}
            value={this.state.start}
            onChange={this.handleStartTime}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="End Time"
            minutesStep={1}
            value={this.state.end}
            onChange={this.handleEndTime}
          />
        </Dialog>

        {/* Material-ui Modal for Existing Event */}
        <Dialog
          title={`View/Edit Appointment of ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={eventActions}
          modal={false}
          open={this.state.openEvent}
          onRequestClose={this.handleClose}
        >
          <ModalMenu 
            defaultValue={this.state.category}
            onChange={e => {
              this.setCategory(e.target.value);
            }}
          />
          <TextField
            defaultValue={this.state.title}
            floatingLabelText="Title"
            onChange={e => {
              this.setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            floatingLabelText="Description"
            multiLine={true}
            defaultValue={this.state.desc}
            onChange={e => {
              this.setDescription(e.target.value);
            }}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="Start Time"
            minutesStep={5}
            value={this.state.start}
            onChange={this.handleStartTime}
          />
          <TimePicker
            format="ampm"
            floatingLabelText="End Time"
            minutesStep={5}
            value={this.state.end}
            onChange={this.handleEndTime}
          />
        </Dialog>
      </div>
    )
  }
}


