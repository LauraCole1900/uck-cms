import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI } from "../../utils/api";

const ConferenceForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [conference, setConference] = useState({
    creatorEmail: "",
    confName: "",
    confOrg: "",
    confDesc: "",
    startDate: "",
    endDate: "",
    confStartTime: "",
    confEndTime: "",
    confType: "",
    confLoc: "",
    confCapConfirm: "",
    confAttendCount: 0,
    confWaiver: false,
  });

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  console.log(confId);

  useEffect(() => {
    if (confId !== "new_conference") {
      ConferenceAPI.getConferenceById(confId).then(resp => {
        console.log("from conferenceForm getConfById", resp.data);
        const confArr = resp.data;
        setConference(confArr[0]);
      })
    } else {
      setConference({ ...conference, creatorEmail: user.email, confAttendees: [user.email] })
    }
    setPageReady(true);
  }, []);

  const handleInputChange = (e) => {
    setConference({ ...conference, [e.target.name]: e.target.value, confAttendees: [] })
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Conference update", confId);
    ConferenceAPI.updateConference({ ...conference }, confId)
      .then(history.push("/conference_updated"))
      .catch(err => console.log(err))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Conference submit")
    ConferenceAPI.createConference({ ...conference, creatorEmail: user.email })
      .then(history.push("/conference_created"))
      .catch(err => console.log(err));
  }

  return (
    <>
      { pageReady === true &&
        isAuthenticated && (
          <Container>
            <Form className="confForm">
              <Row>
                <Form.Group controlId="formConfName">
                  <Form.Label>Name of conference: *</Form.Label>
                  <Form.Control required type="input" name="confName" placeholder="Enter conference name" value={conference.confName} className="confName" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfOrg">
                  <Form.Label>Conference Organization: *</Form.Label>
                  <Form.Control required type="input" name="confOrg" placeholder="Enter name of organizing body" value={conference.confOrg} className="confOrg" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfDesc">
                  <Form.Label>Conference Description: *</Form.Label>
                  <Form.Control required as="textarea" rows={10} type="input" name="confDesc" placeholder="Enter conference description" value={conference.confDesc} className="confDesc" onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfDate">
                  <Col>
                    <Form.Label>Conference Start Date: *</Form.Label>
                    <Form.Control required type="date" name="startDate" placeholder="2021/01/01" value={conference.startDate} className="startDate" onChange={handleInputChange} />
                  </Col>
                  <Col>
                    <Form.Label>Conference End Date: *</Form.Label>
                    <Form.Control required type="date" name="endDate" placeholder="2021/01/01" value={conference.endDate} className="endDate" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfTimes">
                  <Col>
                    <Form.Label>Conference Start Time: *</Form.Label>
                    <Form.Control required type="time" name="confStartTime" placeholder="09:00" value={conference.confStartTime} className="confStartTime" onChange={handleInputChange} />
                  </Col>
                  <Col>
                    <Form.Label>Conference End Time: *</Form.Label>
                    <Form.Control required type="time" name="confEndTime" placeholder="17:00" value={conference.confEndTime} className="confEndTime" onChange={handleInputChange} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfType">
                  <Form.Label>Live or Virtual? *</Form.Label>
                  <Form.Check type="radio" id="confLive" name="confType" label="Live" value="Live" checked={conference.confType === "live"} onChange={handleInputChange} />
                  <Form.Check type="radio" id="confVirtual" name="confType" label="Virtual" value="Virtual" checked={conference.confType === "virtual"} onChange={handleInputChange} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="formConfLoc">
                  {(conference.confType === "live")
                    ? <div>
                      <Form.Label>Conference Location: *</Form.Label>
                      <Form.Control required type="input" name="confLoc" placeholder="Enter street address" value={conference.confLoc} className="confLoc" onChange={handleInputChange} />
                    </div>
                    : <div>
                      <Form.Label>Conference URL: *</Form.Label>
                      <Form.Control required type="input" name="confLoc" placeholder="Enter URL or advisory that URL will be emailed to attendees at a future date" value={conference.confLoc} className="confLoc" onChange={handleInputChange} />
                    </div>}
                </Form.Group>
              </Row>

              {(conference.confType === "live") &&
                <Row>
                  <Form.Group controlId="formConfLocUrl">
                    <Form.Label>Venue Website:</Form.Label>
                    <Form.Control type="input" name="confLocUrl" placeholder="Enter URL of venue's website" value={conference.confLocUrl} className="confLocUrl" onChange={handleInputChange} />
                  </Form.Group>
                </Row>
              }

              <Row>
                <Col sm={6}>
                  <Form.Group controlId="formConfCapConfirm">
                    <Form.Label>Will there be a cap on the number of attendees? *</Form.Label>
                    <Form.Check type="radio" id="confCapYes" name="confCapConfirm" label="Yes" value="yes" checked={conference.confCapConfirm === "yes"} onChange={handleInputChange} />
                    <Form.Check type="radio" id="confCapNo" name="confCapConfirm" label="No" value="no" checked={conference.confType === "no"} onChange={handleInputChange} />
                  </Form.Group>
                </Col>

                {(conference.confCapConfirm === "yes") &&
                  <Col sm={6}>
                    <Form.Group controlId="formConfAttendCap">
                      <Form.Label>Maximum number of attendees:</Form.Label><br />
                      <Form.Text className="capSubtitle" muted>Please enter only numbers with no decimals or commas.</Form.Text>
                      <Form.Control type="input" name="confAttendCap" placeholder="50" onChange={handleInputChange}></Form.Control>
                    </Form.Group>
                  </Col>}
              </Row>

              <Row>
                <Form.Group controlId="formConfWaiver">
                  <Form.Label>Will a liability waiver be required? *</Form.Label>
                  <Form.Control required as="select" name="confWaiver" onChange={handleInputChange}>
                    <option value={false} checked={conference.confWaiver === false}>No</option>
                    <option value={true} checked={conference.confWaiver === true}>Yes</option>
                  </Form.Control>
                </Form.Group>
              </Row>

              <Row>
                {(confId !== "new_conference")
                  ? <Button onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Row>

            </Form>
          </Container>
        )
      }
    </>
  )
}

export default ConferenceForm;