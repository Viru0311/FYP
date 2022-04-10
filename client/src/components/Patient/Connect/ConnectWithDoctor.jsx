import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import "./style.css";
import axios from "axios";
import { SERVER_BASE_URL } from "../../../config/config";
import { UserContext } from "../../../context/user_context";
import { Navigate } from "react-router-dom";

export default function ConnectWithDoctor() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const context = useContext(UserContext);

  useEffect(() => {
    try {
      setDoctorId(context.user.selectedDoctor._id);
      setDoctorName(context.user.selectedDoctor.name);
    } catch (err) {}
  }, [context]);

  useEffect(async () => {
    try {
      const res = await axios.get(
        `${SERVER_BASE_URL}/api/doctor/getConnectList`
      );
      if (res.data.success) setDoctorList(res.data.data);
    } catch (err) {}
  }, []);

  const menuItems = [];
  for (let i in doctorList) {
    menuItems.push(
      <MenuItem key={doctorList[i]._id} value={doctorList[i]._id}>
        {doctorList[i].name}
      </MenuItem>
    );
  }

  const updateDoctorPreference = async (id, name) => {
    const data = { _id: id, name: name };

    if (context.user.selectedDoctor._id === id) return;

    context.updateUser({
      ...context.user,
      selectedDoctor: data,
    });

    try {
      const res = await axios.post(
        `${SERVER_BASE_URL}/api/patient/updateDoctorPreference`,
        data
      );
    } catch (err) {}
  };

  // if (!context.loggedIn) return <Navigate to="/signin"></Navigate>;

  return (
    <center>
      <Typography
        style={{ marginBottom: "10px" }}
        variant="body2"
        color="text.secondary"
      >
        <strong>Note:</strong> The selected doctor will get the consultation
        request.
      </Typography>

      <FormControl required sx={{ mt: 1, width: 500 }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          Choose Doctor
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);

            let name = "";
            for (let i in doctorList) {
              if (doctorList[i]._id === e.target.value) {
                setDoctorName(doctorList[i].name);
                name = doctorList[i].name;
              }
            }

            updateDoctorPreference(e.target.value, name);
          }}
          autoWidth
          label="Choose Doctor"
        >
          {menuItems}
        </Select>
      </FormControl>

      <br />
      <Typography variant="body1" color="text.primary">
        Right now the selected doctor is <strong>{doctorName}</strong>
      </Typography>

      <br />
      <br />
    </center>
  );
}
