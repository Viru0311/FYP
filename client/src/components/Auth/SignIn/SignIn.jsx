import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { SERVER_BASE_URL } from "../../../config/config";
import { UserContext, withUser } from "../../../context/user_context";
import { Navigate } from "react-router-dom";

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      message: "",
      error: false,
      success: false,
      loading: false,
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
      // lets see if we can get the user
      setTimeout(() => {
        this.setState({ redirect: true });
      }, 1500);
    }
  };

  loginUser = (user, cb, updateUser, updateLogInStatus) => {
    axios
      .post(`${SERVER_BASE_URL}/api/auth/login`, user)
      .then((res) => {
        if (res.data.success) {
          updateUser(res.data.user);
          updateLogInStatus(true);

          this.setState({ loggedIn: true });
          cb(res.data.message, false);
        } else {
          cb(res.data.message, true);
        }
      })
      .catch((err) => {
        cb(err.response.data.message || "Something went Wrong!", true);
      });
  };

  handleSubmit = (event, updateUser, updateLogInStatus) => {
    event.preventDefault();
    this.setState({ loading: true });

    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    this.loginUser(data, this.callback, updateUser, updateLogInStatus);
  };

  render() {
    if (this.state.redirect) return <Navigate push to="/" />;

    if (this.props.userContext.loggedIn)
      return (
        <Navigate
          push
          to={"/" + this.props.userContext.user.userType + "/diagnose"}
        />
      );

    return (
      <UserContext.Consumer>
        {({ user, loggedIn, updateUser, updateLogInStatus }) =>
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
                  Sign In
                </Typography>

                <br />
                <p style={{ color: "red" }}>
                  {" "}
                  {this.state.error && this.state.message}
                </p>

                <p style={{ color: "green" }}>
                  {this.state.success && "LogIn Successful"}
                </p>

                <Box
                  component="form"
                  onSubmit={(evt) => {
                    this.handleSubmit(evt, updateUser, updateLogInStatus);
                  }}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={this.state.email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    focused={this.state.email.length > 0 ? true : false}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                    focused={this.state.password.length > 0 ? true : false}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          )
        }
      </UserContext.Consumer>
    );
  }
}

export default withUser(SignIn);
