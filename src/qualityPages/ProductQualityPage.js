import React from "react";
import uomHeader from "../header/uomheader.js";
import Banner from "../_utils/Banner";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import { InformationalNote } from "../_utils/Alert";
import { alertConstants } from "../_constants";
import ReverseTable from "../_utils/ReverseTable";
import { userService } from "../_services";
// import TreeView from '@mui/lab/TreeView';
// import TreeItem from '@mui/lab/TreeItem';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";

class ProductQualityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CodeMetrics: [
        {
          all: 1,
          classes: 0,
          decst: 0,
          excst: 0,
          file: 0,
          func: 0,
          pre: 0,
          ratio: 0,
        },
      ],
      data: [
        {
          all: 10,
          classes: 30,
          decst: 40,
          excst: 50,
          file: 50,
          func: 60,
          pre: 30,
          ratio: 50,
        },
      ],
      hasConfig:
        this.props.teamInfo && this.props.teamInfo[this.props.currentTeamKey],
      projStructure: {},
      loader: true,
      metrics: {
        lineCount: 0,
        commentCount: 0,
        emptyLineCount: 0
      }
    };
  }

  async componentDidMount() {
    if (this.state.hasConfig) {
      // Gets data for product quality graph
      // this.props.getTeamCodeMetrics(this.props.currentTeamKey);
      const projStructure = await userService.getProjectStructure(this.props.currentTeamKey);
      this.setState({
        projStructure: projStructure,
        loader: false
      })
    }
  }

  render() {
    const columns1 = [
      {
        name: "Number of all lines",
        selector: "code_lines_count",
        center: Boolean(true),
      },
      {
        name: "Number of classes",
        selector: "class_count",
        center: Boolean(true),
      },
      {
        name: "Number of files",
        selector: "file_count",
        center: Boolean(true),
      },
      {
        name: "Number of functions",
        selector: "function_count",
        center: Boolean(true),
      },
    ];
    const columns2 = [
      {
        name: "Number of comment lines",
        selector: "comment_lines_count",
        center: Boolean(true),
      },
      {
        name: "Ratio of comment lines to code lines",
        selector: "comment_to_code_ratio",
        center: Boolean(true),
      },
      {
        name: "Number of declarible statements",
        selector: "declarative_lines_count",
        center: Boolean(true),
      },
      {
        name: "Number of excutable statements",
        selector: "executable_lines_count",
        center: Boolean(true),
      },
    ];
    const customStyles = {
      headCells: {
        style: {
          fontSize: "20px",
          background: "#EEEEEE",
        },
      },
      cells: {
        style: {
          fontSize: "20px",
        },
      },
    };

    const renderTree = (nodes) => (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        onClick={() => {
          this.setState({
            metrics: nodes.metrics
          })
        }}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );

    return (
      <div className="uomcontent">
        {uomHeader("Product Quality")}
        <div role="main">
          <div className="page-inner" style={{ textAlign: "center" }} >
            {/* Project Name */}
            <Banner projName={this.props.currentTeamName} />

            {/* Alert Message for No Config found */}
            {!this.state.hasConfig && (
              <InformationalNote message={alertConstants.NO_CONFIG} />
            )}



            {
              this.state.hasConfig &&
                this.state.loader
                ? <CircularProgress size={100} />
                : <Grid
                  spacing={2}
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={6} style={{ maxHeight: '60vh', overflow: 'auto' }}>
                    <TreeView
                      aria-label="rich object"
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpanded={[this.state.projStructure.id]}
                      defaultExpandIcon={<ChevronRightIcon />}
                      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    >
                      {renderTree(this.state.projStructure)}
                    </TreeView>
                  </Grid>
                  <Grid
                    xs={6}
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    <Grid xs={12} item><h3>Metrics</h3></Grid>
                    <Grid
                      container
                      item
                      direction="column"
                      justifyContent="space-between"
                      alignItems="center"
                      xs={6}
                      spacing={2}
                    >
                      <Grid item >Code Lines Count</Grid>
                      <Grid item >Comment Lines Count</Grid>
                      <Grid item >Empty Lines Count</Grid>
                    </Grid>
                    <Grid
                      container
                      item
                      direction="column"
                      justifyContent="space-between"
                      alignItems="center"
                      xs={6}
                      spacing={2}
                    >
                      <Grid item >{this.state.metrics.lineCount}</Grid>
                      <Grid item >{this.state.metrics.commentCount}</Grid>
                      <Grid item >{this.state.metrics.emptyLineCount}</Grid>
                    </Grid>
                  </Grid>
                </Grid>

            }

            {/* Product Quality Graph */}
            {/* {this.state.hasConfig &&
              this.props.teamCodeMetrics &&
              this.props.teamCodeMetrics.length != 0 && (
                <ReverseTable
                  data={this.props.teamCodeMetrics}
                />
              )} */}

            {/* No data alert */}
            {/* {this.state.hasConfig &&
              (!this.props.teamCodeMetrics ||
                this.props.teamCodeMetrics.length == 0) && (
                <InformationalNote message={alertConstants.NO_DATA} />
              )} */}
          </div>
        </div>
      </div >
    );
  }
}

function mapState(state) {
  return {
    teamCodeMetrics: state.user.teamCodeMetrics,
    currentTeamKey: state.user.currentTeamKey,
    currentTeamName: state.user.currentTeamName,
    teamInfo: state.user.teamInfo,
  };
}

const actionCreators = {
  getTeamCodeMetrics: userActions.getTeamCodeMetrics,
};

const ProductQuality = connect(mapState, actionCreators)(ProductQualityPage);
export { ProductQuality as ProductQualityPage };
