import React from "react";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import { SERVER_BASE_URL } from "../../../config/config";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext, withUser } from "../../../context/user_context";

class PatientDiagnose extends React.Component {
  constructor(props) {
    super(props);

    const sex =
      this.props.userContext &&
      this.props.userContext.user &&
      this.props.userContext.user.gender === "male"
        ? 1
        : 0;

    this.state = {
      age: "",
      sex: sex,
      cp: "",
      trtbps: "",
      chol: "",
      fbs: "",
      restecg: "",
      thalachh: "",
      oldpeak: "",
      slp: "",
      caa: "",
      thall: "",
      exng: "", //
      message: "",
      error: false,
      loading: false,
      success: false,
      redirect: false, // will redirect to login page
    };
  }

  callback = (message, error) => {
    this.setState({
      loading: false,
      message: message,
      error: error,
      success: !error,
    });

    if (error) {
      setTimeout(() => {
        this.setState({ ...this.state, message: "", error: false });
      }, 3000);
    } else {
      setTimeout(() => {
        this.setState({ redirect: true });
      }, 1500);
    }
  };

  getPreliminaryResult = (data, cb) => {
    axios
      .post(`${SERVER_BASE_URL}/api/patient/getPreliminaryResult`, data)
      .then((res) => {
        if (res.data.success) {
          res.data.updatedUser &&
            this.props.userContext.updateUser(res.data.updatedUser);
          cb(res.data.message, false);
        } else cb(res.data.message, true);
      })
      .catch((err) => {
        cb(err.response.data.message || "Something went Wrong!", true);
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      inputParams: {
        age: this.state.age,
        sex: this.state.sex,
        cp: this.state.cp,
        trtbps: this.state.trtbps,
        chol: this.state.chol,
        fbs: this.state.fbs,
        restecg: this.state.restecg,
        thalachh: this.state.thalachh,
        exng: this.state.exng,
        oldpeak: this.state.oldpeak,
        slp: this.state.slp,
        caa: this.state.caa,
        thall: this.state.thall,
      },
      inputArray: [
        this.state.age,
        this.state.sex,
        this.state.cp,
        this.state.trtbps,
        this.state.chol,
        this.state.fbs,
        this.state.restecg,
        this.state.thalachh,
        this.state.exng,
        this.state.oldpeak,
        this.state.slp,
        this.state.caa,
        this.state.thall,
      ],
    };

    this.getPreliminaryResult(data, this.callback);
  };

  render() {
    if (this.state.redirect) return <Navigate push to="/patient/results" />;

    return (
      <>
        <UserContext.Consumer>
          {({ loggedIn }) =>
            !loggedIn ? (
              <Navigate push to="/signin" />
            ) : (
              <Container component="main" maxWidth="xs">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <CoronavirusOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Diagnose
                  </Typography>

                  <br />
                  <p style={{ color: "red" }}>
                    {" "}
                    {this.state.error && this.state.message}
                  </p>

                  <p style={{ color: "green" }}>
                    {this.state.success && "Registration Successful"}
                  </p>

                  <Box
                    component="form"
                    onSubmit={this.handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      error={isNaN(this.state.age)}
                      helperText={
                        isNaN(this.state.age)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.age}
                      onChange={(e) =>
                        this.setState({ ...this.state, age: e.target.value })
                      }
                      id="age"
                      label="Age"
                      name="age"
                      margin="normal"
                    />

                    <FormControl required sx={{ mt: 1, width: 500 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        CP
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={this.state.cp}
                        onChange={(e) =>
                          this.setState({ ...this.state, cp: e.target.value })
                        }
                        autoWidth
                        label="CP"
                      >
                        <MenuItem value={0}>Typical Angina</MenuItem>
                        <MenuItem value={1}>Atypical Angina</MenuItem>
                        <MenuItem value={2}>Non-anginal Pain</MenuItem>
                        <MenuItem value={3}>Asymptomatic</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      error={isNaN(this.state.trtbps)}
                      helperText={
                        isNaN(this.state.trtbps)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.trtbps}
                      onChange={(e) =>
                        this.setState({ ...this.state, trtbps: e.target.value })
                      }
                      id="trtbps"
                      label="Trtbps - Resting blood pressure (in mm Hg)"
                      name="trtbps"
                      margin="normal"
                    />

                    <TextField
                      error={isNaN(this.state.chol)}
                      helperText={
                        isNaN(this.state.chol)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.chol}
                      onChange={(e) =>
                        this.setState({ ...this.state, chol: e.target.value })
                      }
                      id="chol"
                      label="Chol - Cholestoral in mg/dl fetched via BMI sensor"
                      name="chol"
                      margin="normal"
                    />

                    <TextField
                      error={isNaN(this.state.fbs)}
                      helperText={
                        isNaN(this.state.fbs)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.fbs}
                      onChange={(e) =>
                        this.setState({ ...this.state, fbs: e.target.value })
                      }
                      id="fbs"
                      label="fbs - (fasting blood sugar)"
                      name="fbs"
                      margin="normal"
                    />

                    <FormControl required sx={{ mt: 1, width: 500 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        Resting electrocardiographic results
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={this.state.restecg}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            restecg: e.target.value,
                          })
                        }
                        autoWidth
                        label="restecg"
                      >
                        <MenuItem value={0}>Normal</MenuItem>
                        <MenuItem value={1}>ST-T wave normality</MenuItem>
                        <MenuItem value={2}>
                          showing probable or definite left ventricular
                          hypertrophy by Estes' criteria
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      error={isNaN(this.state.thalachh)}
                      helperText={
                        isNaN(this.state.thalachh)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.thalachh}
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          thalachh: e.target.value,
                        })
                      }
                      id="thalachh"
                      label="thalachh - (Maximum heart rate achieved)"
                      name="thalachh"
                      margin="normal"
                    />

                    <FormControl required sx={{ mt: 2, width: 500 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        exng - Exercise induced angina
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={this.state.exng}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            exng: e.target.value,
                          })
                        }
                        autoWidth
                        label="exng"
                      >
                        <MenuItem value={0}>No</MenuItem>
                        <MenuItem value={1}>Yes </MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      error={isNaN(this.state.oldpeak)}
                      helperText={
                        isNaN(this.state.oldpeak)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.oldpeak}
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          oldpeak: e.target.value,
                        })
                      }
                      id="oldpeak"
                      label="oldpeak - (Previous peak)"
                      name="oldpeak"
                      margin="normal"
                    />

                    <TextField
                      error={isNaN(this.state.slp)}
                      helperText={
                        isNaN(this.state.slp)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.slp}
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          slp: e.target.value,
                        })
                      }
                      id="slp"
                      label="slp - (slope)"
                      name="slp"
                      margin="normal"
                    />

                    <TextField
                      error={isNaN(this.state.caa)}
                      helperText={
                        isNaN(this.state.caa)
                          ? "Incorrect Entry, should be a number"
                          : ""
                      }
                      required
                      fullWidth
                      value={this.state.caa}
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          caa: e.target.value,
                        })
                      }
                      id="caa"
                      label="caa - (Number of major vessels)"
                      name="caa"
                      margin="normal"
                    />

                    <FormControl required sx={{ mt: 1, width: 500 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        thall - thallium stress test
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={this.state.thall}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            thall: e.target.value,
                          })
                        }
                        autoWidth
                        label="thall"
                      >
                        <MenuItem value={0}>Normal blood flow</MenuItem>
                        <MenuItem value={1}>
                          Abnormal blood flow during exercise
                        </MenuItem>
                        <MenuItem value={2}>
                          Low blood flow during both rest and exercise
                        </MenuItem>
                        <MenuItem value={3}>
                          No thallium visible in parts of the heart
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <br />
                    <br />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Get Preliminary Result
                    </Button>
                  </Box>
                </Box>
              </Container>
            )
          }
        </UserContext.Consumer>
      </>
    );
  }
}

export default withUser(PatientDiagnose);
