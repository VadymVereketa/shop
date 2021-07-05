import {CreatorReducer} from '../base/base';
import {IBaseActions} from '../base/baseTypes';
import {ISellPointsActions, ISellPointsState} from './sellPointsTypes';
import service from '../../services/service';
import {RootState} from '../reducer';
import {ISellPoint} from '../../typings/FetchData';

const init: ISellPointsState = {
  data: [],
  error: null,
  isLoading: false,
  expressSellPoints: [],
};

const creator = new CreatorReducer<ISellPointsActions, ISellPointsState>(
  'sellPoints',
);
creator.addAction('setOptionData', (state, action) => {
  return {...state, ...action.payload};
});
const actionsSellPoints = creator.createActions();

const thunkGetSellPoints = async (dispatch: any, getStore: () => RootState) => {
  if (getStore().sellPoints.data.length > 0) return;

  dispatch(actionsSellPoints.setLoading(false));
  try {
    const res = await service.getSellPoints();
    if (!res.success) {
      throw res.data;
    }
    //todo delete
    const images = [
      'tsum_big.png',
      'poznyaki_big.png',
      'sky-mall_big.png',
      'pic-default.png',
    ];
    images
      .filter((_, i) => i < res.data.length)
      .forEach((img, index) => {
        res.data[index].img = img;
      });

    dispatch(actionsSellPoints.setData(res.data));
  } catch (e) {
    dispatch(actionsSellPoints.setError(e));
  } finally {
    dispatch(actionsSellPoints.setLoading(false));
  }
};

const thunkGetExpressSellPoints = async (
  dispatch: any,
  getStore: () => RootState,
) => {
  if (getStore().sellPoints.expressSellPoints.length > 0) return;

  dispatch(actionsSellPoints.setLoading(false));
  try {
    const res = await service.getExpressSellPoints();

    if (!res.success) {
      throw res.data;
    }
    //todo delete
    const sellpoints: ISellPoint[] = res.data;

    /* sellpoints.forEach((s) => {
      s.img = s.sellPointImage ? s.sellPointImage.uuid : null;
    }); */

    dispatch(
      actionsSellPoints.setOptionData({
        expressSellPoints: sellpoints,
      }),
    );
  } catch (e) {
    dispatch(actionsSellPoints.setError(e));
  } finally {
    dispatch(actionsSellPoints.setLoading(false));
  }
};

const getSellPoints = (ignoreIsActive: boolean) => (state: RootState) => {
  if (ignoreIsActive) {
    return state.sellPoints.data;
  }
  return state.sellPoints.data.filter((s) => s.isActive);
};

const getSellPoint = (id: number) => (state: RootState) => {
  return getSellPoints(false)(state).find((s) => s.id === id);
};

const selectorSellPoint = {
  getExpressSellPoints: (state: RootState) =>
    state.sellPoints.expressSellPoints,
  getAllSellPoints: (state: RootState) => [
    ...state.sellPoints.expressSellPoints,
    ...state.sellPoints.data,
  ],
};

export {
  actionsSellPoints,
  thunkGetSellPoints,
  getSellPoints,
  getSellPoint,
  selectorSellPoint,
  thunkGetExpressSellPoints,
};
export default creator.createReducerFetch(init);
