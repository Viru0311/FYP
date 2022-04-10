import React from "react";
import { withUser } from "../../../context/user_context";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const getTimestamp = (_id) => {
  return new Date(parseInt(_id.slice(0, 8), 16) * 1000).toLocaleString();
};

function PatientResults(props) {
  const datas = props.userContext.user.patientResults || [];
  const content = [];

  for (let i = 0; i < datas.length; i++) {
    const data = datas[i];
    content.push(
      <>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              <span style={{ color: "grey" }}> Preliminary Output - </span>{" "}
              {data.output
                ? "More chance of heart attack"
                : "Less chance of heart attack"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Checked at - {getTimestamp(data._id)}
            </Typography>
          </CardContent>

          <CardActions>
            <Button>Get consultation by doctor</Button>
          </CardActions>
        </Card>
        <br />
      </>
    );
  }

  return <Container>{content}</Container>;
}

export default withUser(PatientResults);
