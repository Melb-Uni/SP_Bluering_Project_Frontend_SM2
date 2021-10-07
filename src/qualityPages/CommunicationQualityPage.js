import React from "react";
import Banner from "../_utils/Banner";
import uomHeader from "../header/uomheader";
import { userActions } from "../_actions";
import { connect } from "react-redux";
import Table from "../_utils/Table";
import { alertConstants } from "../_constants";
import { InformationalNote } from "../_utils/Alert";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { StyledEngineProvider } from "@mui/material/styles";



class CommunicationPage extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    this.state = {
      columns: [
        {
          name: "Meeting Name",
          selector: "title",
        },
        {
          name: "Sprint",
          selector: "sprint",
        },
        {
          name: "Meeting Minutes",
          selector: "link",
          cell: (row) => <a href={row.link}>{row.link}</a>,
        },
      ],
      hasConfig:
        this.props.teamInfo && this.props.teamInfo[this.props.currentTeamKey],
    };
  }
 
  componentDidMount() {
    if (this.state.hasConfig) {
      this.props.getTeamConfluenceMeeting(this.props.currentTeamKey);
    }
  }

  render() {
    return (
      <div className="uomcontent">
        {uomHeader("Communication")}

        <div role="main">
          <div className="page-inner">


            <Banner projName={this.props.currentTeamName} />
            {!this.state.hasConfig && (
              <InformationalNote message={alertConstants.NO_CONFIG} />
            )}
            {this.state.hasConfig &&
              (!this.props.confluenceData ||
                this.props.confluenceData.length == 0) && (
                <InformationalNote
                  message={alertConstants.NO_MEETING_MINUTES} />
              )}
            {this.state.hasConfig &&
              this.props.confluenceData &&
              this.props.confluenceData.length != 0 && (
                this.props.confluenceData[3] &&
                <Table aria-label="collapsible table"
                columns={this.state.columns}
                data={this.props.confluenceData}
                width={"80vw"}
                height={"50vh"} />
              )}
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    confluenceData: state.user.teamConfluenceMeeting,
    currentTeamKey: state.user.currentTeamKey,
    currentTeamName: state.user.currentTeamName,
    teamInfo: state.user.teamInfo,
  };
}

const actionCreators = {
  getTeamConfluenceMeeting: userActions.getTeamConfluenceMeeting,
};

const Communication = connect(mapState, actionCreators)(CommunicationPage);
export { Communication as CommunicationQualityPage };
