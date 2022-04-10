import React from "react";
import { withUser } from "../../../context/user_context";

function PatientResults(props) {
  console.log(props);
  return <div>PatientResults</div>;
}

export default withUser(PatientResults);
