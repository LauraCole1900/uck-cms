import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col, Button, Card, Image, ButtonGroup, ToggleButton } from "react-bootstrap";
import Conference from "../conferenceCard";
import API from "../../utils/api";
import "./style.css";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [whichConf, setWhichConf] = useState();


  const handleInputChange = (e) => {
    const whichConf = e.target.value
    console.log(whichConf)
    setWhichConf(whichConf)
  }


  return (
    isAuthenticated && (
      <Container>
        <Row>
          <Col sm={4}></Col>
          <Card>
            <Row>
              <Col sm={4}>
                <Image fluid className="profilePic" src={user.picture} alt="Profile picture" />
              </Col>
              <Col sm={8}>
                <h1>{user.name}</h1>
                <h3>{user.email}</h3>
              </Col>
            </Row>
          </Card>
          <Col sm={4}></Col>
        </Row>
        <div className="myConfs">
          <h1>My Conferences</h1>
        </div>
        <ButtonGroup toggle>
          <ToggleButton type="radio" name="whichConf" value={1} checked={whichConf === 1} onChange={handleInputChange}>
            Created
          </ToggleButton>
          <ToggleButton type="radio" name="whichConf" value={2} checked={whichConf === 2} onChange={handleInputChange}>
            Attending
          </ToggleButton>
          <ToggleButton type="radio" name="whichConf" value={3} checked={whichConf === 3} onChange={handleInputChange}>
            Presenting
          </ToggleButton>
          <ToggleButton type="radio" name="whichConf" value={4} checked={whichConf === 4} onChange={handleInputChange}>
            Exhibiting
          </ToggleButton>
        </ButtonGroup>
        
      </Container >
    )
  )
}

export default Profile;