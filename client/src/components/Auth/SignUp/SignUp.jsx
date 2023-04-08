import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { SERVER_BASE_URL } from "../../../config/config";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../../context/user_context";
class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
      gender: "",
      userType: "",
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

  registerUser = (user, cb) => {
    axios
      .post(`${SERVER_BASE_URL}/api/auth/register`, user, {
        withCredentials: true
      })
      .then((res) => {
        if (res.data.success) {
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
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      mobile: this.state.mobile,
      password: this.state.password,
      gender: this.state.gender,
      userType: this.state.userType,
    };

    this.registerUser(data, this.callback);
  };

  render() {
    if (this.state.redirect) return <Navigate push to="/signin" />;

    return (
      <>
        <UserContext.Consumer>
          {({ loggedIn }) =>
            loggedIn ? (
              <Navigate push to="/" />
            ) : (
              <Container component="main" maxWidth="xs">
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign Up
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
                      margin="normal"
                      required
                      fullWidth
                      value={this.state.name}
                      onChange={(e) =>
                        this.setState({ ...this.state, name: e.target.value })
                      }
                      id="name"
                      label="Name"
                      name="name"
                      focused={this.state.name.length > 0 ? true : false}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      value={this.state.username}
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          username: e.target.value,
                        })
                      }
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      focused={this.state.username.length > 0 ? true : false}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      value={this.state.email}
                      onChange={(e) =>
                        this.setState({ ...this.state, email: e.target.value })
                      }
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      focused={this.state.email.length > 0 ? true : false}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      value={this.state.mobile}
                      onChange={(e) =>
                        this.setState({ ...this.state, mobile: e.target.value })
                      }
                      name="mobile"
                      label="Mobile"
                      type="mobile"
                      id="mobile"
                      autoComplete="mobile-number"
                      focused={this.state.mobile.length > 0 ? true : false}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      value={this.state.password}
                      onChange={(e) =>
                        this.setState({
                          ...this.state,
                          password: e.target.value,
                        })
                      }
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      focused={this.state.password.length > 0 ? true : false}
                    />

                    <br />
                    <br />
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Gender
                      </FormLabel>

                      <RadioGroup
                        row
                        value={this.state.gender}
                        onChange={(e) => {
                          this.setState({
                            ...this.state,
                            gender: e.target.value,
                          });
                        }}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />

                        <FormControlLabel
                          value="other"
                          control={<Radio />}
                          label="Other"
                        />
                      </RadioGroup>
                    </FormControl>

                    <br />
                    <br />

                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        UserType
                      </FormLabel>
                      <RadioGroup
                        row
                        value={this.state.userType}
                        onChange={(e) => {
                          this.setState({
                            ...this.state,
                            userType: e.target.value,
                          });
                        }}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          value="patient"
                          control={<Radio />}
                          label="Patient"
                        />
                        <FormControlLabel
                          value="pharmacist"
                          control={<Radio />}
                          label="Pharmacist"
                        />
                        <FormControlLabel
                          value="doctor"
                          control={<Radio />}
                          label="Doctor"
                        />
                      </RadioGroup>
                    </FormControl>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign Up
                    </Button>
                    <Grid container>
                      <Grid item>
                        <Link href="/signin" variant="body2">
                          {"Already have an account? Sign In"}
                        </Link>
                      </Grid>
                    </Grid>
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

export default SignUp;
