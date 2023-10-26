import {
  InputAdornment,
  Button,
  TextField,
  useTheme,
  Box,
  Grid,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled, lighten, darken } from "@mui/system";
// import { clipboard } from 'electron';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#5c4d9a" : "#8383de",
    color: "white",
    fontSize: 11,
  },
}));

const DashboardCommandLine = (props) => {
  const theme = useTheme();

  // Add/remove functionality in text box
  const handleChange = (e) => {
    let newUserInput = "";
    // console.log('e.nativeEvent.inputType is: ', e.nativeEvent.inputType);
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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "105%",
        // border: "1px solid blue",
        margin: "15px 0 0 0px",
      }}
    >
      <LightTooltip
        title="Click to change your working directory."
        placement="bottom"
        arrow
        enterDelay={1800}
        leaveDelay={100}
        enterNextDelay={3000}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            margin: "8px 0 0 0px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              width: "89px",
              height: "20px",
              padding: "0 0 0 0px",
              backgroundColor:
                theme.palette.mode === "dark" ? "#120838" : "transparent",
              // border: "1.4px solid yellow",
              zIndex: "100",
              margin: "-5px 0 0 5px",
            }}
          ></div>
          <div
            style={{
              fontSize: "10px",
              width: "100px",
              zIndex: "100",
              margin: "-17px 0 0 10px",
              padding: "-5px 0 0 10px",
            }}
          >
            Working Directory
          </div>
          <Button
            variant="contained"
            component="label"
            style={{
              border:
                theme.palette.mode === "dark"
                  ? "1.4px solid white"
                  : "1.4px solid #e6e1fb",
              borderRadius: "3px",
              background:
                theme.palette.mode === "dark" ? "transparent" : "#e6e1fb",
              height: "54px",
              marginBottom: "10px",
              marginTop: "-6px",
              marginRight: "10px",
              fontSize: "14px",
              letterSpacing: ".5px",
              color:
                theme.palette.mode === "dark" ? "rgb(109, 233, 68)" : "#685aef",
              textTransform: "none",
              // width: "140px",
            }}
          >
            <input
              type="file"
              // @ts-expect-error
              webkitdirectory=""
              hidden
              onChange={props.handleUploadDirectory}
            />{" "}
            {props.shortDir}
          </Button>
        </div>
      </LightTooltip>

      {/* {" "}
      <LightTooltip
        title="Click to change your working directory."
        placement="bottom"
        arrow
        enterDelay={1800}
        leaveDelay={100}
        enterNextDelay={3000}
      >
        <Grid id="directory-item">
          <Button
            variant="contained"
            component="label"
            style={{
              border: "1.4px solid white",
              borderRadius: "3px",
              background:
                theme.palette.mode === "dark" ? "transparent" : "#e6e1fb",
              height: "54px",
              marginBottom: "10px",
              marginTop: "11px",
              marginRight: "10px",
              fontSize: "14px",
              letterSpacing: ".5px",
              color:
                theme.palette.mode === "dark" ? "rgb(109, 233, 68)" : "#685aef",
              textTransform: "none",
            }}
          >
            <input
              type="file"
              // @ts-expect-error
              webkitdirectory=""
              hidden
              onChange={props.handleUploadDirectory}
            />{" "}
            {props.shortDir}
          </Button>
        </Grid>
      </LightTooltip>
      <div
        style={{
          position: "relative",
          top: -28,
          left: -114,
          fontSize: "10px",
          width: "100px",
          height: "20px",
          padding: "0 0 0 0px",
          backgroundColor: "#120838",
        }}
      ></div>
      <div
        style={{
          position: "relative",
          top: -27,
          left: -196,
          fontSize: "10px",
          width: "111px",
          padding: "0 0 0 0px",
        }}
      >
        Working Directory
      </div> */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "85%",
          margin: "0px 0 0 0px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            width: "83px",
            height: "10px",
            padding: "0 0 0 0px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#120838" : "#f6f4fe",
            // border: "1.4px solid yellow",
            zIndex: "100",
            margin: "-5px 0 0 5px",
          }}
        ></div>
        <div
          style={{
            fontSize: "10px",
            width: "83px",
            height: "14px",
            padding: "0 0 0 0px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#120838" : "transparent",
            // border: "1.4px solid yellow",
            zIndex: "100",
            margin: "-10px 0 0 5px",
          }}
        ></div>
        <div
          style={{
            fontSize: "10px",
            width: "100px",
            zIndex: "100",
            margin: "-13px 0 0 10px",
            padding: "0px 0 0 0px",
          }}
        >
          Input Command
        </div>
        <form
          onSubmit={props.handleSubmit}
          data-value={props.command}
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "transparent",
            margin: "-8px 0 0 0px",
          }}
        >
          <TextField
            id="outlined-start-adornment"
            sx={{
              m: 0,
              p: 0,
              width: "60%",
              justifyContent: "start",
              border: "1px solid white",
              borderRadius: "3px",
              background: theme.palette.mode === "dark" ? "#0e0727" : "#e6e1fb",
              // borderColor: 'transparent',
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
              width: "90px",
              color: theme.palette.mode === "dark" ? "white" : "#685aef",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid white"
                  : "1.5px solid #685aef",
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
              width: "90px",
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
    </div>
  );
};

export default DashboardCommandLine;
