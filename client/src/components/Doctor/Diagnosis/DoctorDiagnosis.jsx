import React from "react";
import { withUser } from "../../../context/user_context";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SERVER_BASE_URL } from "../../../config/config";
import axios from "axios";

const getTimestamp = (_id) => {
  return new Date(parseInt(_id.slice(0, 8), 16) * 1000).toLocaleString();
};

function DoctorDiagnosis(props) {
  const datas = props.userContext.user.requestedConsultation || [];
  console.log(datas);

  const [report, setReport] = React.useState({});
  const [consult, setConsult] = React.useState("");
  const [doctorVerdict, setdoctorVerdict] = React.useState("");
  const [serverResponse, setServerResponse] = React.useState({ initial: true });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setReport({});
    setConsult("");
    setdoctorVerdict("");
    setServerResponse({ initial: true });
    setOpen(false);
  };

  const onClickHandler = async (data) => {
    try {
      handleOpen();

      const res = await axios.get(`${SERVER_BASE_URL}/api/patient/getReport`, {
        params: {
          patientId: data.patientId,
          resultId: data.resultId,
        },
      });

      setReport({
        ...res.data.report,
        patientName: data.patientName,
        patientId: data.patientId,
        resultId: data.resultId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const DoctorVerdictHandler = async (evt) => {
    evt.preventDefault();

    const data = {
      patientId: report.patientId,
      resultId: report.resultId,
      consult,
      doctorVerdict,
    };

    const res = await axios.post(
      `${SERVER_BASE_URL}/api/doctor/passFinalVerdict`,
      data
    );

    setServerResponse({ ...res.data, initial: false });
  };

  let content = [];
  for (let i = 0; i < datas.length; i++) {
    const data = datas[i];
    content.push(
      <>
        <Card key={datas[i].resultId}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              <span style={{ color: "grey" }}>
                {" "}
                Preliminary Output Predicted By ML Model -{" "}
              </span>{" "}
              {data.modelOutput
                ? "More chance of heart attack"
                : "Less chance of heart attack"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Patient Name - {data.patientName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Patient Age - {data.patientAge}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Checked at - {getTimestamp(data.patientId)}
            </Typography>
          </CardContent>

          <CardActions>
            <Button onClick={() => onClickHandler(data)}>Diagnose</Button>
          </CardActions>
        </Card>
        <br />
      </>
    );
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Container>{content}</Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <center>
            {!serverResponse.initial ? (
              serverResponse.success ? (
                <span style={{ color: "green" }}>Successfully Updated!</span>
              ) : (
                <span style={{ color: "red" }}>Something Went Wrong!</span>
              )
            ) : null}
            <Typography id="modal-modal-title" variant="h6" component="h3">
              Model Predicts {"->"}{" "}
              {report.output
                ? "More chance of heart attack"
                : "Less chance of heart attack"}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Age - {report.age}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Gender - {report.sex ? "Male" : "Female"}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              CP - {report.cp}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              trtbps - {report.trtbps}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              chol - {report.chol}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              fbs - {report.fbs}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              restecg - {report.restecg}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              thalachh - {report.thalachh}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              oldpeak - {report.oldpeak}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              slp - {report.slp}
            </Typography>{" "}
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              caa - {report.caa}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              thall - {report.thall}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              exng - {report.exng}
            </Typography>
            <br />
            <br />
            <br />
            <br />
            <Typography variant="body2" color="text.secondary">
              Write Feedback
            </Typography>
            <Box
              component="form"
              onSubmit={DoctorVerdictHandler}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextareaAutosize
                aria-label="Consult"
                minRows={3}
                placeholder="Consult"
                style={{ width: 400 }}
                margin="normal"
                required
                id="consult"
                label="Consult"
                name="consult"
                autoComplete="consult"
                value={consult}
                onChange={(e) => {
                  setConsult(e.target.value);
                }}
                autoFocus
              />

              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Has Heart Disease?
                </FormLabel>

                <RadioGroup
                  row
                  value={doctorVerdict}
                  onChange={(e) => {
                    setdoctorVerdict(e.target.value);
                  }}
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel value="1" control={<Radio />} label="yes" />
                  <FormControlLabel value="0" control={<Radio />} label="no" />
                </RadioGroup>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                style={{ width: 400 }}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
            </Box>
          </center>
        </Box>
      </Modal>
    </>
  );
}

export default withUser(DoctorDiagnosis);
