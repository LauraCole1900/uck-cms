import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Image, Form, Button } from "react-bootstrap";
import { PresenterAPI } from "../../utils/api";
import "./style.css";

const PresenterFormCard = (props) => {
  // const emailRef = useRef();
  const [presenter, setPresenter] = useState();

  // Handles click on "Check for existing" button
  // const handleEmailCheck = () => {
  //   const email = emailRef.current
  //   console.log("presForm handleEmailCheck", email.value)
  //   // GETs presenter document by email
  //   PresenterAPI.getPresenterByEmail(email.value, props.conference._id)
  //     .then(resp => {
  //       if (resp.length > 0) {
  //         console.log("from presForm handleEmailCheck", resp.data)
  //         const presObj = resp.data[0]
  //         setPresenter({ ...presenter, presObj })
  //         // PUT presenter document with confId added to confId[] and sessId added to sessId[]
  //         return true
  //       } else {
  //         return false
  //       }
  //     })
  // }

  useEffect(() => {
    console.log("from presFormCard useEffect", props.presenter)
  })


  return (
    <>
      {props.presenter.map(pres => (
        <Card className="formCard" key={pres._id}>
          <Card.Title><h1>Presenter Information</h1></Card.Title>

          <Card.Body className="cardBody">
            <Form.Group controlId="formPresEmail">
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's email: <span className="red">*</span></Form.Label>
                  <Form.Control required type="email" name="presEmail" placeholder="name@email.com" value={pres.presEmail} data-id={pres._id} className="formEmail" readOnly />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresName">
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's first name: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presGivenName" placeholder="Bilbo" value={pres.presGivenName} data-id={pres._id} className="formInput" onChange={props.handleInputChange} />
                </Col>
                <Col sm={6}>
                  <Form.Label>Presenter's last name: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presFamilyName" placeholder="Baggins" value={pres.presFamilyName} data-id={pres._id} className="formInput" onChange={props.handleInputChange} />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Form.Label>Presenter's organization: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presOrg" placeholder="Enter organization the presenter represents" value={pres.presOrg} data-id={pres._id} className="formInput" onChange={props.handleInputChange} />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresContact">
              <Row>
                <Col sm={4}>
                  <Form.Label>Presenter's phone:</Form.Label>
                  <Form.Control type="input" name="presPhone" placeholder="(123)456-7890" value={pres.presPhone} className="formInput" data-id={pres._id} onChange={props.handleInputChange} />
                </Col>
                <Col sm={8}>
                  <Form.Label>Presenter's website URL:</Form.Label>
                  <Form.Control type="input" name="presWebsite" placeholder="http://www.website.com" value={pres.presWebsite} className="formInput" data-id={pres._id} onChange={props.handleInputChange} />
                </Col>
              </Row>
            </Form.Group>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="formPresBio">
                  <Form.Label>Presenter's bio (min 10 characters, max 750 characters): <span className="red">*</span></Form.Label>
                  <Form.Control as="textarea" rows={10} type="input" name="presBio" placeholder="Enter a short bio of the presenter" value={pres.presBio} data-id={pres._id} className="formInput" onChange={props.handleTextArea} />
                  <Form.Text muted>Characters remaining: {props.charRem}</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="formPresPic">
                  <Form.Label>Upload presenter's picture:</Form.Label>
                  <Form.Control type="input" name="presPic" placeholder="URL for presenter's picture" value={pres.presPic} data-id={pres._id} className="formInput" onChange={props.handleInputChange} />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  )
}

export default PresenterFormCard;