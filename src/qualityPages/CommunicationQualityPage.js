import React from "react";
import Banner from "../_utils/Banner";
import uomHeader from "../header/uomheader";
import { userActions } from "../_actions";
import { connect } from "react-redux";
import Table from "../_utils/communicationTable";
import { alertConstants } from "../_constants";
import { InformationalNote } from "../_utils/Alert";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';




class CommunicationPage extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    this.state = {
      columns: [
        {
          name: "Meeting Name",
          selector: row => row.title,
        },
        {
          name: "Sprint",
          selector: row => row.sprint,
        },
        {
          name: "Meeting Minutes",
          selector: row => row.link,
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
                <Table
                columns={this.state.columns}
                data={this.props.confluenceData}
                width={"80vw"}
                height={"50vh"} 
                />
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
