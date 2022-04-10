import React from "react";

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const UserContext = React.createContext({
  user: {},
  loggedIn: false,
  updateUser: (user) => {},
  updateLogInStatus: (logInStatus) => {},
});

export function withUser(Component) {
  return function UserComponent(props) {
    return (
      <UserContext.Consumer>
        {(userContext) => <Component {...props} userContext={userContext} />}
      </UserContext.Consumer>
    );
  };
}
