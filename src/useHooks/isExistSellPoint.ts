import {ISellPoint} from '../typings/FetchData';

const getIsExistSellPoint = (allSellPoints: ISellPoint[], id: number) => {
  return allSellPoints.some((s) => s.id === id);
};

export default getIsExistSellPoint;
