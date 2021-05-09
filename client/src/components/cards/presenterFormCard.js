import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Image, Form, Button } from "react-bootstrap";
import { PresenterAPI } from "../../utils/api";
import "./style.css";

const PresenterFormCard = (props) => {
  const [presenter, setPresenter] = useState(props.presenter);
  const [charRem, setCharRem] = useState(750);

  // // Handles input changes to form fields
  // const handleInputChange = (e) => {
  //   const { dataset, name, value } = e.target
  //   // find where object._id that matches dataset.id and stick data on that object
  //   setPresenter(presenter.map(pres => pres._id === dataset.id ? { ...pres, [name]: value } : pres))
  //   console.log({ presenter });
  // };

  // // Handles character limit and input changes for textarea
  // const handleTextArea = (e) => {
  //   const { dataset, name, value } = e.target
  //   const charCount = value.length;
  //   const charLeft = 750 - charCount;
  //   setCharRem(charLeft);
  //   setPresenter(presenter.map(pres => pres._id === dataset.id ? { ...pres, [name]: value } : pres))
  // }

  useEffect(() => {
    console.log("from presFormCard useEffect", presenter)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenter])


  return (
    <>
      {presenter.map(pres => (
        <Card className="formCard" key={pres._id}>
          <Card.Title><h1>Presenter Information</h1></Card.Title>

          <Card.Body className="cardBody">
            <Form.Group controlId={pres._id}>
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's email: <span className="red">*</span></Form.Label>
                  <Form.Control required type="email" name="presEmail" placeholder="name@email.com" value={pres.presEmail} className="formEmail" readOnly />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresName">
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's first name: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presGivenName" placeholder="Samwise" value={pres.presGivenName} data-id={pres._id} className="formInput" onChange={props.handleInputChange} />
                </Col>
                <Col sm={6}>
                  <Form.Label>Presenter's last name: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presFamilyName" placeholder="Gamgee" value={pres.presFamilyName} data-id={pres._id} className="formInput" onChange={props.handleInputChange} />
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