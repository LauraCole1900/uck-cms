import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, ButtonGroup, Table } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { ScheduleForm } from "../forms";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const Schedule = () => {
  // Generates a table for each day of the conference
  // Room identifiers across the top
  // Times down the side
  // Cells populate from SessionAPI: session cards? Not sure
  // Sessions that take more than one room (keynote, etc) should stretch across those rooms
  // User should be able to click on a table cell to edit that session
  // When editing, user is given a drop-down menu of sessions that already exist in the database?

  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState();
  const [schedule, setSchedule] = useState();
  const [confReady, setConfReady] = useState(false);

  // Grabs conference ID from URL
  const urlArray = window.location.href.split("/")
  const urlId = urlArray[urlArray.length - 1]
  const urlType = urlArray[urlArray.length - 2]
  // 

  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("from presForm getConfById", resp.data)
        const confObj = resp.data;
        setConference(confObj)
        setConfReady(true);
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchConf(urlId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {confReady === true &&
        <Container>
          <Row>
            {isAuthenticated &&
              <Col sm={8}>
                <UserCard />
              </Col>}
          </Row>
          <Row>
            <Col sm={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={4}>
              <ButtonGroup data-toggle="popover">
                <Link to={`/details/${urlId}`} className={location.pathname === `/details/${urlId}` ? "link active" : "link"}>
                  <Button title="View details" className="button">Details</Button>
                </Link>
                <Link to={`/venue/${urlId}`} className={location.pathname === `/venue/${urlId}` ? "link active" : "link"}>
                  <Button title="Venue information" className="button">Venue</Button>
                </Link>
                <Link to={`/exhibits/${urlId}`} className={location.pathname === `/exhibits/${urlId}` ? "link active" : "link"}>
                  <Button title="Exhibit information" className="button">Exhibits</Button>
                </Link>
              </ButtonGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="myConfs">
              <h1>{conference.confName} Schedule</h1>
            </Col>
          </Row>

          <Row>
            <ScheduleForm conference={conference} schedule={schedule} urlid={urlId} urltype={urlType} />
          </Row>

          <Row>
            <Table striped border="true" hover responsive>
              <thead>
                <tr>

                </tr>
              </thead>
            </Table>
          </Row>
        </Container>}
    </>
  )
}

export default Schedule;