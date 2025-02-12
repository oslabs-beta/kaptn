import React from "react";
import {
  InputAdornment,
  Button,
  TextField,
  useTheme,
  Box,
  Grid,
} from "@mui/material";
// import { clipboard } from 'electron';

const CommandLine = (props) => {
  const theme = useTheme();

  // Add/remove functionality in text box
  const handleChange = (e) => {
    let newUserInput = "";

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      newUserInput = props.userInput.slice(0, props.userInput.length - 1);
    } else {
      newUserInput =
        props.userInput + e.target.value[e.target.value.length - 1];
    }
    props.setUserInput(newUserInput);
  };

  const handleClear = (e) => {
    let userInput2 = "";

    props.setUserInput(userInput2);
    props.setVerb(userInput2);
    props.setType(userInput2);
    props.setName(userInput2);
    props.setFlags([]);
  };

  // const handlePaste = (event) => {
  //   let userInput = event.clipboardData.items[0].getAsString();
  //   //   console.log(userInput);
  //   props.setUserInput(userInput);
  //   //   props.setVerb(userInput);
  //   //   props.setType(userInput);
  //   //   props.setName(userInput);
  //   //   props.setFlags([]);
  // };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0px 0 0 0px",
      }}
    >
      {" "}
      <form
        onSubmit={props.handleSubmit}
        data-value={props.command}
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "transparent",
          marginLeft: "0px",
        }}
      >
        <TextField
          id="outlined-start-adornment"
          sx={{
            m: 0,
            p: 0,
            width: "76%",
            justifyContent: "start",
            border: "1px solid white",
            borderRadius: "3px",
            background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                style={{
                  color:
                    theme.palette.mode === "dark"
                      ? "rgb(109, 233, 68)"
                      : "#685aef",
                }}
              >
                <strong> $ </strong>
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            handleChange(e);
          }}
          value={props.command}
          // onPaste={(e) => {
          //   handlePaste(e);
          // }}
        />
        <Button
          type="submit"
          id="runButt"
          variant="contained"
          style={{
            margin: "1px 6px 0 8px",
            background: "transparent",
            fontSize: "16px",
            height: "53px",
            width: "11%",
            color: "white",
            backgroundColor: "#685aef",
          }}
        >
          Run
        </Button>
        <Button
          id="clear-button"
          variant="contained"
          onClick={(e) => {
            handleClear(e);
          }}
          style={{
            margin: "1px 0px 0 3px",
            justifyContent: "center",
            height: "53px",
            width: "10%",
            fontSize: "11px",
            color: theme.palette.mode === "dark" ? "lightgrey" : "grey",
            background: "transparent",
            border: ".1px solid gray",
          }}
        >
          Clear
        </Button>
      </form>
    </div>
  );
};

export default CommandLine;
