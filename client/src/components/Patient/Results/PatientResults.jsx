import React, { useContext } from "react";
import { UserContext, withUser } from "../../../context/user_context";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SERVER_BASE_URL } from "../../../config/config";
import axios from "axios";

const getTimestamp = (_id) => {
  return new Date(parseInt(_id.slice(0, 8), 16) * 1000).toLocaleString();
};

function PatientResults(props) {
  const datas = props.userContext.user.patientResults || [];
  const context = useContext(UserContext);
  const content = [];
  console.log(datas);
  const onClickHandler = async (data) => {
    try {
      const res = await axios.post(
        `${SERVER_BASE_URL}/api/patient/getConsultationByDoctor`,
        data
      );

      const user = context.user;
      for (let i = 0; i < user.patientResults.length; i++) {
        if (user.patientResults[i]._id === data._id)
          user.patientResults[i].appliedForConsultation = true;
      }

      context.updateUser(user);
    } catch (err) {}
  };

  for (let i = 0; i < datas.length; i++) {
    const data = datas[i];
    content.push(
      <>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              <span style={{ color: "grey" }}>
                {" "}
                Preliminary Output By Model -{" "}
              </span>{" "}
              {data.output
                ? "More chance of heart attack"
                : "Less chance of heart attack"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Checked at - {getTimestamp(data._id)}
            </Typography>
          </CardContent>

          {data.appliedForConsultation ? (
            !data.doctorDiagnosis ? (
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Waiting for Doctor response
                </Typography>
              </CardContent>
            ) : null
          ) : (
            <CardActions>
              <Button onClick={() => onClickHandler(data)}>
                Get consultation by doctor
              </Button>
            </CardActions>
          )}

          {data.doctorDiagnosis ? (
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                <span style={{ color: "grey" }}> Doctor Verdict - </span>{" "}
                {data.doctorDiagnosis.output
                  ? "More chance of heart attack"
                  : "Less chance of heart attack"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Comment By Doctor - {data.doctorDiagnosis.comment}
              </Typography>
            </CardContent>
          ) : null}
        </Card>
        <br />
      </>
    );
  }

  return <Container>{content}</Container>;
}

export default withUser(PatientResults);
