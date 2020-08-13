export interface IODataModel {
  filter?: any;
  expand?: any;
  orderBy?: any;
  search?: any;
  top?: number | null;
  skip?: number | null;
  count?: boolean | null;
}
