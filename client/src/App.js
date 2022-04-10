import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import axios from "axios";
import _ from "lodash";

import { SERVER_BASE_URL } from "./config/config";
import "./App.scss";
import AppLayout from "./components/Layout/AppLayout";
import Blank from "./pages/Blank";
import SignIn from "./components/Auth/SignIn/SignIn.jsx";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";
import { UserContext } from "./context/user_context";
import PatientDiagnose from "./components/Patient/Diagnosis/PatientDiagnose";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.updateUser = (user) => {
      const immutableUser = _.cloneDeep(user);
      this.setState({ user: { ...immutableUser } });
    };

    this.updateLogInStatus = (logInStatus) => {
      this.setState({ loggedIn: logInStatus });
    };

    this.state = {
      user: {},
      loggedIn: false,
      updateUser: this.updateUser,
      updateLogInStatus: this.updateLogInStatus,
    };
  }

  componentDidMount() {
    //(TODO): Have to change route, inorder to accomodate doctor
    axios
      .get(`${SERVER_BASE_URL}/api/patient/getPatientData`)
      .then((res) => {
        if (res.data.success) {
          this.updateUser(res.data.user);
          this.updateLogInStatus(true);

          this.setState({ loggedIn: true });
        }
      })
      .catch((err) => {});
  }
  render() {
    return (
      <UserContext.Provider value={this.state}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Blank text="home" />} />
              <Route
                path="/consultation"
                element={<Blank text="Consultation" />}
              />
              <Route path="/diagnose" element={<Blank text="Diagnose" />} />
              <Route path="/results" element={<Blank text="Results" />} />
              <Route path="/signin" element={<SignIn text="signin" />} />
              <Route path="/signup" element={<SignUp text="signup" />} />

              {/* Patient routes */}
              <Route path="/patient/diagnose" element={<PatientDiagnose />} />
              <Route
                path="/patient/results"
                element={<Blank text="Results" />}
              />
              <Route
                path="/patient/appointments"
                element={<Blank text="Appointments" />}
              />

              {/* Doctor routes */}
              <Route
                path="/doctor/diagnose"
                element={<Blank text="diagnose" />}
              />
              <Route
                path="/doctor/consultation"
                element={<Blank text="consultation" />}
              />
            </Route>{" "}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    );
  }
}
