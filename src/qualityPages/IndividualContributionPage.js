import React from "react";
import uomHeader from "../header/uomheader.js";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import { Tab, Col, Row, Container } from "react-bootstrap";
import ButtonGroup from "../_utils/ButtonGroup";
import { commonConstants } from "../_constants";
import { ToastContainer } from "react-toastify";
import Banner from "../_utils/Banner";
import DonutChart from "../_utils/DonutChart";
import RadarChart from "../_utils/RadarChart";
import DropdownMenus from "../_utils/DropdownMenus";
import { InformationalNote } from "../_utils/Alert";
import { alertConstants } from "../_constants";
import { userService } from "../_services";
import { formatDonutChartData } from "../_utils/formatDonutChartData.js";
import CircularProgress from '@material-ui/core/CircularProgress';


class IndividualContributionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      btnNames: [
        commonConstants.CONFLUENCE,
        commonConstants.GITHUB,
        commonConstants.JIRA,
      ],
      btnSelected: commonConstants.CONFLUENCE,
      selectedStudent: "All",
      studentList: [],
      hasConfig:
        this.props.teamInfo && this.props.teamInfo[this.props.currentTeamKey],
      loader: true,
      confluenceData: null,
      githubData: null,
      jiraData: null
    };

    this.selectStudent = this.selectStudent.bind(this);
    this.handleBtnGroupClick = this.handleBtnGroupClick.bind(this);
  }

  async componentDidMount() {
    if (this.state.hasConfig) {
      const [confluenceData, gitHubData, jiraData] = await Promise.all([
        userService.getConfluenceIndividualData(this.props.currentTeamKey),
        userService.getGithubIndividualData(this.props.currentTeamKey),
        userService.getJiraIndividualData(this.props.currentTeamKey)
      ]);
      this.setState({
        confluenceData: formatDonutChartData(confluenceData),
        githubData: gitHubData.data,
        jiraData: formatDonutChartData(jiraData),
        loader: false
      });
    }
  }

  handleBtnGroupClick(e) {
    let picked = e.currentTarget.firstChild.innerHTML;
    if (picked === commonConstants.CONFLUENCE) {
      console.log("getConfluenceIndividualData");
      this.props.getConfluenceIndividualData(this.props.currentTeamKey);
    } else if (picked === commonConstants.GITHUB) {
      this.props.getGithubIndividualData(this.props.currentTeamKey);
    } else {
      this.props.getJiraIndividualData(this.props.currentTeamKey);
    }
    this.setState({
      btnSelected: picked,
      selectedStudent: "All",
    });
  }

  selectStudent(e) {
    this.setState({ selectedStudent: e.target.value });
  }

  render() {
    return (
      <div className="uomcontent">
        <ToastContainer limit={1} />
        {uomHeader("Individual Contribution")}
        <div role="main">
          <div className="page-inner">
            <Banner projName={this.props.currentTeamName} />
            {!this.state.hasConfig && (
              <InformationalNote message={alertConstants.NO_CONFIG} />
            )}
            {this.state.hasConfig && (
              <Container>
                <Tab.Container id="left-tabs-example">

                  <Row>

                    <Col style={{ textAlign: "center" }}>
                      {this.state.loader ?
                        <CircularProgress size={100} />
                        :
                        <RadarChart
                          data={this.state.confluenceData ? this.state.confluenceData["All"].labels : []}
                          data2={this.state.githubData}
                          data3={this.state.confluenceData}
                          dataLabel={"Edited Pages"}
                          jiraData={this.state.jiraData}
                        />
                      }
                    </Col>

                  </Row>
                </Tab.Container>
              </Container>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    individualGithubData: state.user.individualGitHubCommits,
    individualConfluenceData: state.user.individualConfluencePages,
    individualJiraData: state.user.individualJiraCounts,
    currentTeamKey: state.user.currentTeamKey,
    currentTeamName: state.user.currentTeamName,
    teamInfo: state.user.teamInfo,
  };
}

const actionCreators = {
  getGithubIndividualData: userActions.getGithubIndividualData,
  getConfluenceIndividualData: userActions.getConfluenceIndividualData,
  getJiraIndividualData: userActions.getJiraIndividualData,
};

const Product = connect(mapState, actionCreators)(IndividualContributionPage);
export { Product as IndividualContributionPage };
