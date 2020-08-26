import {CreatorReducer} from '../base/base';
import {IBaseActions} from '../base/baseTypes';
import {ISellPointsState} from './sellPointsTypes';
import service from '../../services/service';
import {RootState} from '../reducer';

const init: ISellPointsState = {
  data: [],
  error: null,
  isLoading: false,
};

const creator = new CreatorReducer<IBaseActions, ISellPointsState>(
  'sellPoints',
);
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

const getSellPoints = (ignoreIsActive: boolean) => (state: RootState) => {
  if (ignoreIsActive) {
    return state.sellPoints.data;
  }
  return state.sellPoints.data.filter((s) => s.isActive);
};

const getSellPoint = (id: number) => (state: RootState) => {
  return getSellPoints(false)(state).find((s) => s.id === id);
};

export {actionsSellPoints, thunkGetSellPoints, getSellPoints, getSellPoint};
export default creator.createReducerFetch(init);
