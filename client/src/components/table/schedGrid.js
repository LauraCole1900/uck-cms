import React from "react";
import { Table } from "react-bootstrap";
import { SchedSessCard } from "../cards";
import "./style.css";

const SchedGrid = (props) => {
  let thisSess;
  let timesArr;

  const splitTimes = (times) => {
    timesArr = times.split("-")
    return timesArr;
  }

  // Parses time to 12-hour
  const parseTime = (time) => {
    const timeArr = time.split(":");
    let hours = timeArr[0];
    let minutes = timeArr[1];
    const ampm = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr = `${hours}:${minutes}${ampm}`
    return timeStr
  };

  const filterSess = (sess, room, time) => {
    const scheduleDate = props.date;
    const scheduleStart = splitTimes(time)[0];
    const scheduleEnd = splitTimes(time)[1];
    thisSess = sess.filter(sess => (
      sess.sessDate === scheduleDate &&
      sess.sessRoom === room &&
      (parseTime(sess.sessStart) === scheduleStart || parseTime(sess.sessEnd) === scheduleEnd)
    ))
    return thisSess;
  }


  return (
    <>
      <Table striped border="true" hover responsive>
        <thead>
          <tr>
            <th className="schHead"></th>
            {props.schedule.schedRooms.map((room, roomidx) => (
              <th key={roomidx} value={room.value} className="schHead center">{room}</th>))}
          </tr>
        </thead>
        <tbody>
          {props.schedule.schedTimes.map((time, timeidx) => (
            <tr key={timeidx}>
              <th className="schHead center" value={time.value}>{time}</th>
              {props.schedule.schedRooms.map((room, roomdataidx) => (
                <td key={roomdataidx} className="schedCells center">
                  <SchedSessCard session={filterSess(props.sessions, room, time)} allSess={props.sessions} presenters={props.presenters} conference={props.conference} room={room} time={time} startTime={timesArr[0]} endTime={timesArr[1]} date={props.date} urlid={props.urlid} urltype={props.urltype} change={props.change} />
                </td>
              ))}
              <th className="schHead center" value={time.value}>{time}</th>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

}

export default SchedGrid;