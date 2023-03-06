import React, { Component } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from '@fullcalendar/rrule';
import moment from "moment";
import { logger } from "../../helpers";
import "./index.scss"
import { AppRoutes } from "../../config/AppRoutes";

export default class Appointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }
  /**
   *
   */
  onDateClick = ({ date, ...props }) => {
    logger(props);
    if (moment(date).diff(moment(), "days") >= 0) {
      this.props.addAppointment(null, date);
    }
  };
  /**
   *
   */
  onEventClick = info => {
    if (!(info.event.url)) {
      this.props.onEventClick(info.event.id);
    } else {
      // window.open(info.event.url, "_blank");
      this.props.onGoPage(info.event.url);
    }
  };
  /**
   *
   */
  render() {
    let { data, filter, userReducer } = this.props;
    if (!data) {
      data = [];
    }
    const events = data.map(event => {
      const startHours = moment.utc(event.startTime).format("HH");
      const endHours = moment.utc(event.endTime).format("HH");
      const startMin = moment.utc(event.startTime).format("mm");
      const endMin = moment.utc(event.endTime).format("mm");
      let appointmentDate = new Date(event.appointmentDate);

      return {
        id: event._id,
        title: event.appointmentTitle,
        start: new Date(appointmentDate).setUTCHours(startHours, startMin),
        end: startHours < endHours || (startHours === endHours && startMin <= endMin) ? new Date(appointmentDate).setUTCHours(endHours, endMin) : new Date(appointmentDate.setDate(appointmentDate.getDate() + 1)).setUTCHours(endHours, endMin),
        color: event.appointmentColor,
        customRender: true
      };
    });
    let events1 = [];
    let events2 = [];
    if (userReducer && userReducer.users && userReducer.users.length) {
      events1 = userReducer.users.filter(item => item.anniversary !== "" && item.anniversary !== null && item.anniversary !== undefined && (moment().diff(moment(item.anniversary), "year") >= 1)).map(event => {
        // const anniversaryNo = moment().diff(moment(event.anniversary), "year");
        const url = (AppRoutes.STAFF_MEMBERS_DETAILS.url).replace(":id", event._id);
        return {
          id: event._id,
          title: `${event.firstName ? event.firstName : ""} ${event.lastName ? event.lastName : ""} anniversary`,
          start: event.anniversary ? new Date(event.anniversary) : new Date(),
          color: "#000",
          allDay: true, // will make the time hide
          url: `${window.location.protocol}//${window.location.host}${url}?tab=Technician%20%20Info`,
          rrule: {
            freq: 'YEARLY',
            interval: 1,
            dtstart: event.anniversary ? new Date(event.anniversary) : new Date(),
          },
        }
      });
      events2 = userReducer.users.filter(item => item.dob !== "" && item.dob !== null && item.dob !== undefined && (moment().diff(moment(item.dob), "year") >= 1)).map(event => {
        // const dobNo = moment().diff(moment(event.dob), "year");
        const url = (AppRoutes.STAFF_MEMBERS_DETAILS.url).replace(":id", event._id);
        return {
          id: event._id,
          title: `${event.firstName ? event.firstName : ""} ${event.lastName ? event.lastName : ""} birthday`,
          start: event.dob ? new Date(event.dob) : new Date(),
          color: "#00f",
          allDay: true, // will make the time hide
          url:`${window.location.protocol}//${window.location.host}${url}?tab=Technician%20%20Info`,
          rrule: {
            freq: 'YEARLY',
            interval: 1,
            dtstart: event.dob ? new Date(event.dob) : new Date(),
          },
        }
      });
    }
    // let event = events.concat(events1);
    return (
      <div>
        <FullCalendar
          header={{
            left: "title",
            center: "prev,next today",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}
          defaultView={filter && filter !== {} && filter.search ? (filter.search !== "today" && filter.search !== "week" ? "dayGridMonth" : (filter.search === "today" ? "timeGridDay" : "timeGridWeek")) : "dayGridMonth"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          weekends={true}
          timeZone='UTC'
          eventSources={[
            {
              events: events
            },
            {
              events: events1
            },
            {
              events: events2
            }
          ]}
          // events={event}
          displayEventTime={true}
          displayEventEnd={true}
          eventClick={this.onEventClick}
          dateClick={this.onDateClick}
          eventLimit={4}
          showNonCurrentDates={false}
          fixedWeekCount={false}
          slotLabelFormat={[
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }
          ]}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </div>
    );
  }
}
