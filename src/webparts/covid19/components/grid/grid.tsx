import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { IGridStates, IGridProps } from "../ICovid19Props";
import "./grid.css";
import "ag-grid-enterprise";
import SideBar from "../sideBar/sideBar";

export default class Grid extends React.Component<IGridProps, IGridStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      columnDefs: [],
      rowData: [],
      inDistrictLevel: false,
      selectedDistrict: "none",
      selectedState: "none",
      totalIndiaCount: "none",
    };
    this.rowSelected = this.rowSelected.bind(this);
    this.loadInitialGrid = this.loadInitialGrid.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }
  public componentDidMount() {
    this.loadInitialGrid();
  }

  public loadInitialGrid() {
    this.setState({
      selectedDistrict: "none",
    });
    let gridData = [];
    const stateData = this.props.statesData;
    let Iactive = 0,
      Ideceased = 0,
      Irecovered = 0,
      Iconfirmed = 0;
    stateData.forEach(({ state, data }) => {
      let activeCount = 0,
        deceasedCount = 0,
        confirmedCount = 0,
        recoveredCount = 0;
      for (let district in data.districtData) {
        let { active, confirmed, deceased, recovered } = data.districtData[
          district
        ];
        activeCount += active;
        confirmedCount += confirmed;
        deceasedCount += deceased;
        recoveredCount += recovered;
      }
      if (state !== "State Unassigned") {
        Iconfirmed += confirmedCount;
        Iactive += activeCount;
        Ideceased += deceasedCount;
        Irecovered += recoveredCount;
        gridData.push({
          state,
          active: activeCount,
          deceased: deceasedCount,
          confirmed: confirmedCount,
          recovered: recoveredCount,
        });
        if (state === "Andaman and Nicobar Islands") {
          this.setState({
            selectedState: {
              state,
              active: activeCount,
              deceased: deceasedCount,
              confirmed: confirmedCount,
              recovered: recoveredCount,
            },
          });
        }
      }
    });
    this.setState({
      columnDefs: [
        { headerName: "STATE", field: "state", filter: true },
        { headerName: "CONFIRMED", field: "confirmed", sortable: true },
        { headerName: "ACTIVE", field: "active", sortable: true },
        { headerName: "DECEASED", field: "deceased", sortable: true },
        { headerName: "RECOVERED", field: "recovered", sortable: true },
      ],
      rowData: [...gridData],
      inDistrictLevel: false,
      totalIndiaCount: {
        active: Iactive,
        recovered: Irecovered,
        confirmed: Iconfirmed,
        deceased: Ideceased,
      },
    });
  }

  public rowSelected(row: any) {
    if (!this.state.inDistrictLevel) {
      let { state } = row.data;
      let gridData = [];
      let { districtData } = this.props.statesDataObject[state];
      for (let district in districtData) {
        let { active, deceased, confirmed, recovered } = districtData[district];
        gridData.push({ district, active, deceased, confirmed, recovered });
      }
      this.setState({
        columnDefs: [
          { headerName: "DISTRICT", field: "district", filter: true },
          { headerName: "CONFIRMED", field: "confirmed", sortable: true },
          { headerName: "ACTIVE", field: "active", sortable: true },
          { headerName: "DECEASED", field: "deceased", sortable: true },
          { headerName: "RECOVERED", field: "recovered", sortable: true },
        ],
        rowData: [...gridData],
        inDistrictLevel: true,
      });
    }
  }

  public handleRowClick(row: any) {
    if (this.state.inDistrictLevel) {
      this.setState({
        selectedDistrict: row.data,
      });
    } else {
      this.setState({
        selectedState: row.data,
      });
    }
  }

  public render() {
    let backButton;
    if (this.state.inDistrictLevel) {
      backButton = (
        <button
          type="button"
          className="back-button btn btn-primary btn-arrow-left"
          onClick={this.loadInitialGrid}
        >
          Back
        </button>
      );
    } else {
      backButton = <span></span>;
    }
    let sideBar;
    if (this.state.totalIndiaCount === "none") {
      sideBar = <span></span>;
    } else {
      sideBar = (
        <SideBar
          currState={this.state.selectedState}
          currDistrict={this.state.selectedDistrict}
          IndiaData={this.state.totalIndiaCount}
        />
      );
    }
    return (
      <React.Fragment>
        <div className="ag-theme-alpine grid-class">
          {backButton}
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            rowSelection="single"
            suppressCellSelection={true}
            onRowDoubleClicked={this.rowSelected}
            onRowClicked={this.handleRowClick}
          />
        </div>
        {sideBar}
      </React.Fragment>
    );
  }
}
