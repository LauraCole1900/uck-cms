import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AttendeeAPI, ConferenceAPI } from "../../utils/api";
import "./style.css";

const Registration = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [conference, setConference] = useState({});
  const [attendee, setAttendee] = useState({});

  // Breaks down the URL
  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const formType = urlArray[urlArray.length - 2]
  console.log("registrationForm update", formType)

  useEffect(() => {
    if (isAuthenticated) {
      // GET call for conference information
      ConferenceAPI.getConferenceById(confId)
        .then(resp => {
          console.log("from registrationForm getConferenceById", resp.data)
          const confArr = resp.data[0];
          setConference(confArr);
        })
        .catch(err => console.log(err));

      switch (formType) {
        case "register_edit":
          // GET call to pre-populate form if URL indicates this is an already-registered attendee
          AttendeeAPI.getAttendeeToUpdate(confId, user.email)
            .then(resp => {
              console.log("from registrationForm getAttendeeToUpdate", resp.data)
              const attArr = resp.data
              setAttendee(attArr)
            })
            .catch(err => console.log(err));
          break;
        default:
          // Sets conference ID in state as attendee.confId and the user's email as attendee.email
          setAttendee({ ...attendee, confId: confId, email: user.email })
      }
    }
    setPageReady(true);
  }, [])

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setAttendee({ ...attendee, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Attendee update", confId, user.email);
    // PUT call to update attendee document
    AttendeeAPI.updateAttendee({ ...attendee }, confId, user.email)
      .then(res => {
        // If no errors thrown, push to Success page
        if (!res.err) {
          history.push("/attendee_updated")
        }
      })
      // If yes errors thrown, push to Error page
      .catch(err => {
        history.push(`/attupdate_error/${err}`)
        console.log(err)
      })
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Attendee submit", confId, user.email, attendee)
    // POST call to create attendee document
    AttendeeAPI.registerAttendee({ ...attendee, confId: confId, email: user.email })
      .then(res => {
        // If no errors thrown, push to Success page
        if (!res.err) {
          history.push(`/register_success/${confId}`)
        }
      })
      // If yes errors thrown, push to Error page
      .catch(err => {
        history.push(`/attreg_error/${err}`)
        console.log(err)
      })
  };

  
  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to register.</h1>
          <div className="authLogo"><Image fluid className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      { pageReady === true &&
        isAuthenticated && (
          <Container>
            {(conference.confWaiver === "yes") &&
              <div className="alert">
                <h5>A signed liability waiver will be required to participate in this event. It will be available at check-in to the event.</h5>
              </div>}
            <Form className="regForm">

              <Card className="formCard">
                <Card.Title>
                  <Row>
                    <Col sm={12}>
                      <h1>Personal & Professional Information</h1>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <p className="subtitle">Please note that BCMS automatically assigns the logged-in email as your contact email.</p>
                    </Col>
                  </Row>
                </Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Form.Group controlId="formRegName">
                      <Col sm={6}>
                        <Form.Label>Given name: <span className="red"><span className="red">*</span></span></Form.Label>
                        <Form.Control required type="input" name="givenName" placeholder="Martha" value={attendee.givenName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Family name: <span className="red">*</span></Form.Label>
                        <Form.Control required type="input" name="familyName" placeholder="Jones" value={attendee.familyName} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group controlId="formRegPhone">
                      <Col sm={6}>
                        <Form.Label>Contact phone #: <span className="red">*</span></Form.Label><br />
                        <Form.Control required type="input" name="phone" placeholder="(123)456-7890" value={attendee.phone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="formRegEmployer">
                        <Form.Label>Company, organization or school you represent:</Form.Label>
                        <Form.Control type="input" name="employerName" placeholder="Torchwood Institute" value={attendee.employerName} className="formInput" onChange={handleInputChange} />
                        <Form.Label>Address of your company, organization or school:</Form.Label>
                        <Form.Control type="input" name="employerAddress" placeholder="219 W 48th Street, New York, NY" value={attendee.employerAddress} className="formInput" onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="formCard">
                <Card.Title>
                  <Row>
                    <Col sm={12}>
                      <h1>Emergency Information</h1>
                    </Col>
                  </Row>
                </Card.Title>
                <Card.Body className="cardBody">
                  <Row>
                    <Form.Group controlId="formRegEmergencyContact">
                      <Col sm={6}>
                        <Form.Label>Emergency contact name:</Form.Label>
                        <Form.Control type="input" name="emergencyContactName" placeholder="Sarah Jane Smith" value={attendee.emergencyContactName} className="formInput" onChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Emergency contact phone #:</Form.Label>
                        <Form.Control type="input" name="emergencyContactPhone" placeholder="(987)654-3210" value={attendee.emergencyContactPhone} className="formInput" onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Row>

                  {(conference.confAllergies === "yes") &&
                    <Row>
                      <Form.Group controlId="allergyConfirm">
                        <Col sm={6}>
                          <Form.Label>Do you have known allergies?</Form.Label>
                          <Form.Check type="radio" id="allergiesYes" name="allergyConfirm" label="Yes" value="yes" checked={attendee.allergyConfirm === "yes"} onChange={handleInputChange} />
                          <Form.Check type="radio" id="allergiesNo" name="allergyConfirm" label="No" value="no" checked={attendee.allergyConfirm === "no"} onChange={handleInputChange} />
                        </Col>
                        {(attendee.allergyConfirm === "yes") &&
                          <Col sm={6}>
                            <Form.Label>Please list your allergies:</Form.Label>
                            <Form.Control as="textarea" rows={5} name="allergies" placeholder="Peanuts, Eggs, Soy, Milk, Bee stings, Penicillin, etc." value={attendee.allergies} className="formText" onChange={handleInputChange} />
                          </Col>}
                      </Form.Group>
                    </Row>}
                </Card.Body>
              </Card>

              <Row>
                {(formType === "register_edit")
                  ? <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Row>

            </Form>
          </Container>
        )
      }
    </>
  )

}

export default Registration;