import {IODataModel} from '../typings/IODataModel';
const buildQuery: any = require('odata-query').default;

export default (params?: IODataModel) => {
  return buildQuery(params);
};
