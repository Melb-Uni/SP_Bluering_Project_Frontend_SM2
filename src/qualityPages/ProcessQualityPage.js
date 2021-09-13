import React from "react";
import ButtonGroup from "../_utils/ButtonGroup";
import Banner from "../_utils/Banner";
import LineChart from "../_utils/LineChart";
import uomHeader from "../header/uomheader.js";
import { userActions } from "../_actions";
import { connect } from "react-redux";
import { commonConstants } from "../_constants";
import { ToastContainer } from "react-toastify";
import { Spin } from "antd";
import { InformationalNote } from "../_utils/Alert";
import { alertConstants } from "../_constants";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import "./ProcessQualityPage.css";
import { makeStyles } from '@material-ui/core/styles';

class ProcessQualityPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      btnNames: [
        commonConstants.CONFLUENCE,
        commonConstants.GITHUB,
        commonConstants.JIRA,
      ],
      sprint: "Sprint 0",
      sprintCollection: [
        "Sprint 0",
        "Sprint 1",
        "Sprint 2",
      ],
      open: false,
      btnSelected: commonConstants.CONFLUENCE,
      scrollPosition: 0,
      hasConfig:
        this.props.teamInfo && this.props.teamInfo[this.props.currentTeamKey],
    };

    this.handleBtnGroupClick = this.handleBtnGroupClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);


    // const useStyles = makeStyles((theme) => ({
    //   button: {
    //     display: 'block',
    //     marginTop: theme.spacing(2),
    //   },
    //   formControl: {
    //     margin: theme.spacing(1),
    //     minWidth: 120,
    //   },
    // }));
    // this.classes = useStyles();
  }

  handleBtnGroupClick(e) {
    let selected = e.currentTarget.firstChild.innerHTML;
    if (selected == commonConstants.CONFLUENCE) {
      this.props.getTeamConfluencePages(this.props.currentTeamKey);
    } else if (selected == commonConstants.GITHUB) {
      this.props.getTeamGithubCommits(this.props.currentTeamKey);
    } else {
      this.props.getTeamJiraTickets(this.props.currentTeamKey);
    }
    this.setState({
      btnSelected: selected,
    });
  }

  handleScroll() {
    this.setState({
      scrollPosition: window.pageYOffset,
    });
  }

  componentDidMount() {
    if (this.state.hasConfig) {
      this.props.getTeamConfluencePages(this.props.currentTeamKey);
    }
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate() {
    window.scrollTo(0, parseInt(this.state.scrollPosition));
  }

  setSprint(newValue) {
    this.setState({
      sprint: newValue
    })
  }

  setOpen(choice) {
    this.setState({
      open: choice
    })
  }

  handleChange = (event) => {
    this.setSprint(event.target.value);
  };

  render() {
    return (
      <div className="uomcontent">
        {uomHeader("Process Quality")}
        <div role="main">
          <div className="page-inner">
            <Banner projName={this.props.currentTeamName} />
            {!this.state.hasConfig && (
              <InformationalNote message={alertConstants.NO_CONFIG} />
            )}
            {this.state.hasConfig && (
              <ButtonGroup
                btnNames={this.state.btnNames}
                clickHandler={this.handleBtnGroupClick}
                selected={this.state.btnSelected}
              />
            )}
            <Spin
              spinning={
                this.props.requestTeamConfluencePages ||
                this.props.requestTeamGithubCommits ||
                this.props.requestTeamJiraTickets
              }
            >
              {this.state.hasConfig &&
                this.state.btnSelected == commonConstants.CONFLUENCE && (   //Generate Line Chart for confluence pages
                  <LineChart data={this.props.confluenceData} />
                )}
              {this.state.hasConfig &&
                this.state.btnSelected == commonConstants.GITHUB && (   //Generate Line Chart for GitHub commit
                  <LineChart data={this.props.githubData} />
                )}
              {this.state.hasConfig &&
                this.state.btnSelected == commonConstants.JIRA && (     //Generate Line Chart for Jira tickets
                  <div>
                    <div className="jira-dropdown">
                    <FormControl>
                      <InputLabel id="demo-controlled-open-select-label">Sprint</InputLabel>
                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={this.state.open}
                        onClose={() => this.setOpen(false)}
                        onOpen={() => this.setOpen(true)}
                        value={this.state.sprint}
                        onChange={this.handleChange}
                      >
                        {this.state.sprintCollection.map(el => <MenuItem value={el}>{el}</MenuItem>)}
                      </Select>
                    </FormControl>
                    </div>
                    <div className="jira-graph">
                      <LineChart data={this.props.jiraData} />
                    </div>
                  </div>
                )}
            </Spin>
          </div>
        </div>
        <ToastContainer limit={1} />
      </div>
    );
  }
}

function mapState(state) {
  return {
    requestTeamConfluencePages: state.user.requestTeamConfluencePages,
    requestTeamGithubCommits: state.user.requestTeamGithubCommits,
    requestTeamJiraTickets: state.user.requestTeamJiraTickets,
    confluenceData: state.user.teamConfluencePages,
    githubData: state.user.teamGithubCommits,
    jiraData: state.user.teamJiraTickets,
    currentTeamKey: state.user.currentTeamKey,
    currentTeamName: state.user.currentTeamName,
    teamInfo: state.user.teamInfo,
  };
}

const actionCreators = {
  getTeamConfluencePages: userActions.getTeamConfluencePages,
  getTeamGithubCommits: userActions.getTeamGithubCommits,
  getTeamJiraTickets: userActions.getTeamJiraTickets,
};

const qualityPage = connect(mapState, actionCreators)(ProcessQualityPage);
export { qualityPage as ProcessQualityPage };
