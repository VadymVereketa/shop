import {CreatorReducer} from '../base/base';
import {IBaseActions} from '../base/baseTypes';
import {ICategoryState} from './categoryTypes';
import service from '../../services/service';
import {RootState} from '../reducer';
import {IRootCategory} from '../../typings/FetchData';

interface ICategoryActions extends IBaseActions {}

const init: ICategoryState = {
  data: [],
  error: null,
  isLoading: false,
};

const creator = new CreatorReducer<ICategoryActions, ICategoryState>(
  'category',
);
creator.addAction('setCategories', (state, action) => {
  return {...state, categories: action.payload};
});
const {setLoading, setData, setError} = creator.createActions();

const thunkGetCustomCategories = async (
  dispatch: any,
  getStore: () => RootState,
) => {
  if (getStore().category.data.length > 0) return;
  dispatch(setLoading(false));
  try {
    const data: IRootCategory[] = [];
    const res = await service.getRootCategories();
    if (!res.success) {
      throw res.error;
    }
    if (res.success) {
      const results = await Promise.all(
        res.data!.map((item) => service.getChildrenCategories(item.id)),
      );
      results.forEach((child, index) => {
        const rootItem = res.data![index];
        if (child.success) {
          if (child.data!.length < 1) return;
          data.push({
            id: rootItem.id,
            name: rootItem.name,
            description: rootItem.description,
            ord: rootItem.ord,
            children: child.data!.map((d: any) => ({
              id: d.id,
              name: d.name,
              description: d.description,
              ord: d.ord,
              parentId: rootItem.id,
              img: d.categoryImages ? d.categoryImages.uuid : null,
            })),
          });
        }
      });
      dispatch(setData(data));
    }
  } catch (e) {
    dispatch(setError(null));
  } finally {
    dispatch(setLoading(false));
  }
};

const getCustomCategories = (state: RootState) => state.category.data;
const getRootId = (id: number) => (state: RootState) => {
  const root = state.category.data.find((r) =>
    r.children.some((c) => c.id === id),
  )!;
  return root.id;
};
const getFirstCaterogry = (id: number) => (state: RootState) => {
  if (state.category.data.length === 0) return null;
  const findItem = state.category.data.find((c) => c.id === id);
  if (findItem) {
    return findItem.children[0].id;
  }
  return null;
};
const getNameCategory = (id: number) => (state: RootState) => {
  for (let root of state.category.data) {
    for (let c of root.children) {
      if (c.id === id) {
        return c.name;
      }
    }
  }
  return '';
};
export {
  setLoading,
  setData,
  setError,
  thunkGetCustomCategories,
  getCustomCategories,
  getFirstCaterogry,
  getRootId,
  getNameCategory,
};
export default creator.createReducerFetch(init);
