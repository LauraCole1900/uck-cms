import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Table, Form, Card, Image, ButtonGroup, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceCard, UserCard } from "../cards";
import AttendeeTable from "./attendeeTable.js";
import ExhibitorTable from "./exhibitorTable.js";
import PresenterTable from "./presenterTable.js";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI, PresenterAPI } from "../../utils/api";
import "./style.css";

const TableComp = (e) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [attendees, setAttendees] = useState([]);
  const [conference, setConference] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [sortAscending, setSortAscending] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [confReady, setConfReady] = useState(false);

  const urlArray = window.location.href.split("/");
  const confId = urlArray[urlArray.length - 1];
  const dataSet = urlArray[urlArray.length - 2];

  const attHeaders = ["familyName", "givenName", "email", "phone", "employerName", "emergencyContactName", "emergencyContactPhone", "allergies", "isAdmin"];
  const exhHeaders = ["exhFamilyName", "exhGivenName", "exhEmail", "exhPhone", "exhCompany", "exhWorkerName1", "exhWorkerName2", "exhWorkerName3", "exhWorkerName4", "exhSpaces", "exhAttend"];
  const presHeaders = ["presFamilyName", "presGivenName", "presEmail", "presPhone", "presOrg", "presWebsite", "presSessionIds", "sessionName"];

  // GET conference info for useEffect and callback
  const fetchConf = async (confId) => {
    await ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("table getConfsById", resp.data)
        setConference(resp.data)
      })
      .catch(err => console.log(err))
    setConfReady(true);
  }

  // GETs attendees for useEffect and callback
  const fetchAttendees = async (confId) => {
    await AttendeeAPI.getAttendees(confId)
      .then(resp => {
        console.log("table fetchAttendees", resp.data)
        const attSort = ascendingSort(resp.data, "familyName")
        setAttendees(attSort)
      })
      .catch(err => console.log(err))
  }

  // GETs exhibitors for useEffect
  const fetchExhibitors = async (confId) => {
    await ExhibitorAPI.getExhibitors(confId)
      .then(resp => {
        console.log("table fetchExhibitors", resp.data)
        const exhSort = ascendingSort(resp.data, "exhFamilyName")
        setExhibitors(exhSort)
      })
      .catch(err => console.log(err))
  }

  // GETs presenters for useEffect
  const fetchPresenters = async (confId) => {
    await PresenterAPI.getPresenters(confId)
      .then(resp => {
        console.log("table fetchPresenters", resp.data)
        const presSort = ascendingSort(resp.data, "presFamilyName")
        setPresenters(presSort)
      })
      .catch(err => console.log(err))
  }

  // Search method
  const getFilteredData = (data, arr, prop) => {
    return data.filter((arr) => arr[prop].toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }

  // Defines which array to search based on searchBy and dataSet variables
  const searchFilter = (data) => {
    switch (searchBy) {
      case "name":
        switch (dataSet) {
          case "exhibitors":
            return getFilteredData(data, exhibitors, "exhFamilyName");
          case "presenters":
            return getFilteredData(data, presenters, "presFamilyName");
          default:
            return getFilteredData(data, attendees, "familyName");
        }
      case "email":
        switch (dataSet) {
          case "exhibitors":
            return getFilteredData(data, exhibitors, "exhEmail");
          case "presenters":
            return getFilteredData(data, presenters, "presEmail");
          default:
            return getFilteredData(data, attendees, "email");
        }
      case "org":
        switch (dataSet) {
          case "exhibitors":
            return getFilteredData(data, exhibitors, "exhCompany");
          case "presenters":
            return getFilteredData(data, presenters, "presOrg");
          default:
            return getFilteredData(data, attendees, "employerName");
        }
      default:
        switch (dataSet) {
          case "exhibitors":
            return (exhibitors);
          case "presenters":
            return (presenters);
          default:
            return (attendees);
        }
    }
  }

  // Sort ascending
  const ascendingSort = (arr, value) => {
    return arr.sort((a, b) => (a[value] > b[value]) ? 1 : -1);
  }

  // Sort descending
  const descendingSort = (arr, value) => {
    return arr.sort((a, b) => (a[value] > b[value]) ? -1 : 1);
  }

  // Toggles boolean on sort to re-render page
  const ascendingSortSet = () => {
    switch (sortAscending) {
      case false:
        setSortAscending(true)
        break;
      default:
        setSortAscending(false)
    }
  }

  // Sort by column header
  const sortBy = (e) => {
    switch (dataSet) {
      case "exhibitors":
        const sortExh = (sortAscending) ? ascendingSort(exhibitors, e.target.innerHTML) : descendingSort(exhibitors, e.target.innerHTML)
        setExhibitors(sortExh)
        ascendingSortSet();
        break;
      case "presenters":
        const sortPres = (sortAscending) ? ascendingSort(presenters, e.target.innerHTML) : descendingSort(presenters, e.target.innerHTML)
        setPresenters(sortPres)
        ascendingSortSet();
        break;
      default:
        const sortAtt = (sortAscending) ? ascendingSort(attendees, e.target.innerHTML) : descendingSort(attendees, e.target.innerHTML)
        setAttendees(sortAtt)
        ascendingSortSet();
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchConf(confId)

      switch (dataSet) {
        case "exhibitors":
          fetchExhibitors(confId);
          break;
        case "presenters":
          fetchPresenters(confId);
          break;
        default:
          fetchAttendees(confId);
      }
    }
    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confId, dataSet])

  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to access this feature.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        pageReady === true &&
        confReady === true &&
        <Container>
          <Row>
            <Col lg={6} md={12}>
              <UserCard />
            </Col>
            <Col lg={6} md={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={2}>
              <ButtonGroup data-toggle="popover">
                <Link to={`/schedule/${confId}`} className={location.pathname === `/schedule/${confId}` ? "link active" : "link"}>
                  <Button title="View schedule" className="button">Schedule</Button>
                </Link>
                <Link to={`/venue/${confId}`} className={location.pathname === `/venue/${confId}` ? "link active" : "link"}>
                  <Button title="Venue information" className="button">Venue</Button>
                </Link>
              </ButtonGroup>
            </Col>
            <Col sm={1}></Col>
            {isAuthenticated &&
              (user.email === conference[0].ownerEmail || conference[0].confAdmins.includes(user.email)) &&
              <>
                <Col sm={4}>
                  <ButtonGroup data-toggle="popover">
                    <Link to={`/attendees/${confId}`} className={location.pathname === `/attendees/${confId}` ? "link active" : "link"}>
                      <Button title="View conference attendees" className="button">Attendees</Button>
                    </Link>
                    <Link to={`/exhibitors/${confId}`} className={location.pathname === `/exhibitors/${confId}` ? "link active" : "link"}>
                      <Button title="View conference exhibitors" className="button">Exhibitors</Button>
                    </Link>
                    <Link to={`/presenters/${confId}`} className={location.pathname === `/presenters/${confId}` ? "link active" : "link"}>
                      <Button title="View conference presenters" className="button">Presenters</Button>
                    </Link>
                  </ButtonGroup>
                </Col>
                <Col sm={1}></Col>
                <Col sm={4}>
                  <ButtonGroup data-toggle="popover">
                    <Link to={`/edit_conference/${confId}`} className={location.pathname === `/edit_conference/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit this conference" className="button">Edit Conference</Button>
                    </Link>
                    <Link to={`/edit_schedule/${confId}`} className={location.pathname === `/edit_schedule/${confId}`}>
                      <Button data-toggle="popover" title="Edit conference schedule" className="button">Edit Schedule</Button>
                    </Link>
                    <Link to={`/new_session/${confId}`} className={location.pathname === `/new_session/${confId}`}>
                      <Button data-toggle="popover" title="Add a session" className="button">Add Session</Button>
                    </Link>
                  </ButtonGroup>
                </Col>
              </>}
          </Row>

          <Row>
            <Col className="center">
              {dataSet === "attendees" &&
                <h1>Attendees</h1>}
              {dataSet === "exhibitors" &&
                <h1>Exhibitors</h1>}
              {dataSet === "presenters" &&
                <h1>Presenters</h1>}
            </Col>
          </Row>
          <Row className="instr">
            <Col sm={4}></Col>
            <Col sm={6}>
              <Card.Body>
                <Form inline="true">
                  <Row>
                    <Col sm={5}>
                      <Form.Group controlId="confSearchBy">
                        <Form.Control inline="true" as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                          <option value="all">View All</option>
                          <option value="name">Search by Family Name</option>
                          <option value="email">Search by Email</option>
                          <option value="org">Search by Organization</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      {(searchBy !== "all") &&
                        <div id="confPageSearch">
                          <Form.Control inline="true" className="mr-lg-5 search-area" type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>}
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Col>
            <Col sm={2}>
              {dataSet === "attendees" &&
                <Button data-toggle="popover" title="Add an attendee" className="button">Add Attendee</Button>}
              {dataSet === "exhibitors" &&
                <Button data-toggle="popover" title="Add an exhibitor" className="button">Add Exhibitor</Button>}
              {dataSet === "presenters" &&
                <Button data-toggle="popover" title="Add a presenter" className="button">Add Presenter</Button>}
            </Col>
          </Row>
          <Row className="instr">
            <Col sm={3}>
              <p className="subhead">Click column headers to sort</p>
            </Col>
          </Row>
          <Table striped border="true" hover responsive>
            <thead>
              <tr>
                {dataSet === "attendees" &&
                  attendees.length > 0 && (
                    attHeaders.map((data, idx) => (
                      <td key={idx} value={data.value} className="tHead" onClick={sortBy}>{data}</td>
                    )))}
                {dataSet === "exhibitors" &&
                  exhibitors.length > 0 && (
                    exhHeaders.map((data, idx) => (
                      <td key={idx} value={data.value} className="tHead" onClick={sortBy}>{data}</td>
                    )))}
                {dataSet === "presenters" &&
                  presenters.length > 0 && (
                    presHeaders.map((data, idx) => (
                      <td key={idx} value={data.value} className="tHead" onClick={sortBy}>{data}</td>
                    )))}
              </tr>
            </thead>
            <tbody>
              {dataSet === "attendees" && (
                attendees.length > 0
                  ? <AttendeeTable attendees={searchFilter(attendees)} conference={conference} confcb={fetchConf} attcb={fetchAttendees} />
                  : <tr><td className="tableComm">We can't seem to find any registered attendees at this time. If you think this is an error, please contact us.</td></tr>)}
              {dataSet === "exhibitors" && (
                exhibitors.length > 0
                  ? <ExhibitorTable exhibitors={searchFilter(exhibitors)} conference={conference} confcd={fetchConf} exhcb={fetchExhibitors} />
                  : <tr><td className="tableComm">We can't seem to find any exhibitors registered for this conference. If you think this is an error, please contact us.</td></tr>)}
              {dataSet === "presenters" && (
                presenters.length > 0
                  ? <PresenterTable presenters={searchFilter(presenters)} conference={conference} confcb={fetchConf} prescb={fetchPresenters} />
                  : <tr><td className="tableComm">We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</td></tr>)}
            </tbody>
          </Table>
        </Container>
      }
    </>
  )

}

export default TableComp;