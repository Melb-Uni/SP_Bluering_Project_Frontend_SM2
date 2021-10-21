import React from "react";
import Banner from "../_utils/Banner";
import uomHeader from "../header/uomheader";
import { userActions } from "../_actions";
import { connect } from "react-redux";
import Table from "../_utils/Table";
import { alertConstants } from "../_constants";
import { InformationalNote } from "../_utils/Alert";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

class CommunicationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          name: "Meeting Name",
          selector: "title",
        },

        {
          name: "Meeting Minutes",
          selector: "link",
          cell: (row) => <a href={row.link}>{row.link}</a>,
        },
      ],
      hasConfig:
        this.props.teamInfo && this.props.teamInfo[this.props.currentTeamKey],
      sprintSelected: "Meeting+notes",
      sprintList: [
        { label: "All", value: "Meeting+notes" },
        { label: "Sprint 1", value: "Sprint+1" },
        { label: "Sprint 2", value: "Sprint+2" }
      ]
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
                  message={alertConstants.NO_MEETING_MINUTES}
                />
              )}
            {
              <div style={{ marginLeft: "2rem" }}>
                <FormControl fullWidth >
                  <InputLabel id="demo-simple-select-label">Sprint</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.selectedSprint}
                    label="Sprint"
                    onChange={(e) => {

                      this.setState({ selectedSprint: e.target.value })
                    }}
                  >
                    {this.state.sprintList.map(el => <MenuItem value={el.value}>{el.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>
            }
            {this.state.hasConfig &&
              this.props.confluenceData &&
              this.props.confluenceData.length != 0 && (
                <Table
                  columns={this.state.columns}
                  data={this.props.confluenceData.filter(el => {
                    return el.link.includes(this.state.selectedSprint)
                  })}
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
