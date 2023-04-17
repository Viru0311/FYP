import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import PatientResults from "./components/Patient/Results/PatientResults";
import ConnectWithDoctor from "./components/Patient/Connect/ConnectWithDoctor";
import DoctorDiagnosis from "./components/Doctor/Diagnosis/DoctorDiagnosis";
import PharmacistApprove from "./components/Pharmacist/Pharmacist";
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme=createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    mode:'dark'
  },
})

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
      .get(`${SERVER_BASE_URL}/api/patient/getPatientData`,{withCredentials:true})
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
      <ThemeProvider theme={theme}>
      <UserContext.Provider value={this.state}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/signin" />} />
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
              <Route path="/patient/results" element={<PatientResults />} />
              <Route
                path="/patient/connect_with_doctor"
                element={<ConnectWithDoctor />}
              />

              {/* Doctor routes */}
              <Route path="/doctor/diagnose" element={<DoctorDiagnosis />} />
              <Route path="/pharmacist/diagnose" element={<PharmacistApprove/>} />
              <Route
                path="/doctor/consultation"
                element={<Blank text="consultation" />}
              />
            </Route>{" "}
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
      </ThemeProvider>
    );
  }
}
