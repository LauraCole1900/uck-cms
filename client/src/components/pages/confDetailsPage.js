import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Form, Card, Button, ButtonGroup } from "react-bootstrap";
import { ConferenceCard, PresenterCard, SessionCard, UserCard } from "../cards"
import { ConferenceAPI, SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [conference, setConference] = useState([]);
  const [sessArray, setSessArray] = useState([]);
  const [searchBy, setSearchBy] = useState("allPnS");
  const [search, setSearch] = useState("");
  const [confReady, setConfReady] = useState(false);
  const [sessReady, setSessReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  // Pull conference ID from URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  const fetchConf = async (confId) => {
    await ConferenceAPI.getConferenceById(confId)
      .then(resp => {
        console.log("confDetailsPage getConfsById", resp.data)
        const confObj = resp.data.slice(0)
        setConference(confObj)
      })
      .catch(err => console.log(err))

    setConfReady(true);
  }

  const fetchSess = async (confId) => {
    await SessionAPI.getSessions(confId)
      .then(resp => {
        const sessArr = resp.data;
        setSessArray(sessArr);
      })
      .catch(err => console.log(err))

    setSessReady(true);
  }

  useEffect(() => {
    // GET conference by ID
    fetchConf(confId);
    // GET sessions by conference ID
    fetchSess(confId);

    setPageReady(true);
  }, [confId])

  // Filter response data by user input
  const searchFilter = (data) => {
    switch (searchBy) {
      // Filter session names
      case "sessionName":
        return data.filter((session) => session.sessName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Filter presenter names
      case "presenterName":
        return data.filter((session) => session.sessPresenter.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Return all response data
      default:
        return (sessArray)
    }
  }


  return (
    <>
      {confReady === true &&
        sessReady === true &&
        pageReady === true &&
        <Container>
          <Row>
            <Col sm={8}>
              {isAuthenticated &&
                <UserCard />}
            </Col>
            <Col sm={4}>
              <Card.Body>
                <Form inline>
                  <Row>
                    <Form.Group controlId="sessSearchBy">
                      <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                        <option value="allPnS">View All</option>
                        <option value="allPres">View Presenters</option>
                        <option value="allSess">View Sessions</option>
                        <option value="presenterName">Search by Presenter Name</option>
                        <option value="presenterOrg">Search by Presenter Organization</option>
                        <option value="sessionName">Search Sessions by Name</option>
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  {(searchBy === "presenterName" || searchBy === "presenterOrg" || searchBy === "sessionName") &&
                    <Row>
                      <div id="sessPageSearch">
                        <Form.Control type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                    </Row>}
                </Form>
              </Card.Body>
            </Col>
          </Row>

          {!isAuthenticated &&
            <Row>
              <h1 className="regRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
                log in
                </Link> to register.</h1>
            </Row>}

          <Row>
            <Col sm={12}>
              <ConferenceCard conference={conference} />
            </Col>
          </Row>

          <Row>
            <Col sm={1}></Col>
            <Col sm={3}>
              <ButtonGroup data-toggle="popover">
                <Link to={`/schedule/${confId}`} className={location.pathname === `/schedule/${confId}` ? "link active" : "link"}>
                  <Button title="View schedule" className="button">Schedule</Button>
                </Link>
                <Link to={`/venue/${confId}`} className={location.pathname === `/venue/${confId}` ? "link active" : "link"}>
                  <Button title="Venue information" className="button">Venue</Button>
                </Link>
              </ButtonGroup>
            </Col>
            {isAuthenticated &&
              (user.email === conference[0].creatorEmail || conference[0].confAdmins.includes(user.email)) &&
              <div>
                <Col sm={4}></Col>
                <Col sm={3}>
                  <ButtonGroup data-toggle="popover">
                    <Link to={`/edit_schedule/${confId}`} className={location.pathname === `/edit_schedule/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit schedule" className="button">Edit Schedule</Button>
                    </Link>
                    <Link to={`/add_session/${confId}`} className={location.pathname === `/add_session/${confId}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Add session" className="button">Add Session</Button>
                    </Link>
                  </ButtonGroup>
                </Col>
              </div>}
          </Row>

          <Row>
            {searchBy === "allPres" &&
              <Col sm={12}>
                <h1>Presenters</h1>
                {sessArray.length > 0
                  ? <PresenterCard session={searchFilter(sessArray)} />
                  : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
              </Col>}
            {(searchBy === "allSess" || searchBy === "sessionName") &&
              <Col sm={12}>
                <h1>Sessions</h1>
                {sessArray.length > 0
                  ? <SessionCard session={searchFilter(sessArray)} />
                  : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
              </Col>}
            {(searchBy === "allPnS" || searchBy === "presenterName" || searchBy === "presenterOrg") &&
              <div>
                <Col sm={6}>
                  <h1>Presenters</h1>
                  {sessArray.length > 0
                    ? <PresenterCard session={searchFilter(sessArray)} />
                    : <h3>We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
                <Col sm={6}>
                  <h1>Sessions</h1>
                  {sessArray.length > 0
                    ? <SessionCard session={searchFilter(sessArray)} />
                    : <h3>We can't seem to find any sessions for this conference. If you think this is an error, please contact us.</h3>}
                </Col>
              </div>}
          </Row>

        </Container>
      }
    </>
  )

}

export default ConfDetails;