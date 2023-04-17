import React, { useEffect,useState} from "react";
// import { withUser } from "../context/user_context";
import {withUser} from "../../context/user_context";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SERVER_BASE_URL } from "../../config/config";
import axios from "axios";

const getTimestamp = (_id) => {
  return new Date(parseInt(_id.slice(0, 8), 16) * 1000).toLocaleString();
};

function PharmacistApprove() {
  const [datas,setData]=useState([]);
    useEffect(()=>{
        const getData=async()=>{
        const res=await axios.post(`${SERVER_BASE_URL}/api/pharmacist/showPatients`,{
            withCredentials: true
        })
    
        setData(res.data.data);
    }
      if(datas.length==0)
       getData()
    },[datas]);
  console.log(datas);


  const onClickHandler = async (data) => {
    try {
      //  console.log(data);
      const res = await axios.post(`${SERVER_BASE_URL}/api/pharmacist/approvePatient`,  {   
        patientId: data.patientId,
        resultId: data.resultId
      },{
        withCredentials: true,
      });
      window.location.reload();

    //   setReport({
    //     ...res.data.report,
    //     patientName: data.patientName,
    //     patientId: data.patientId,
    //     resultId: data.resultId,
    //   });
    } catch (err) {
      console.log(err);
    }
  };

  let content = [];
  // console.log(datas.length);
  for (let i = 0; i < datas.length; i++) {
    const data = datas[i];
    if (!datas[i].verified)
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
                Checked at - {getTimestamp(data.patientId)}
              </Typography>
            </CardContent>
         
            <CardActions>
               <Button onClick={() => onClickHandler(data)}>Approve</Button>
               
            </CardActions>
          </Card>
          <br />
        </>
      );
  }

  if (content.length === 0)
    content = [<span style={{ color: "grey" }}>No pending consultations</span>];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: "85%",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //  console.log(content);
  return (
    <>
      <Container>{content}</Container>

    
    </>
  );
}

export default withUser(PharmacistApprove);
