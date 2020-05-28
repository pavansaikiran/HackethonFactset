export interface ICovid19Props {
  description: string;
}

export interface ICovid19States {
  title: string;
  subTitle: string;
  siteTabTitle: string;
  stateWiseDataInArray: Array<any>,
  stateWiseDataInObject: any
}

export interface IGridStates {
  columnDefs: Array<any>;
  rowData: Array<any>;
}
