import {CreatorReducer} from '../base/base';
import {IBaseActions} from '../base/baseTypes';
import {ICategoryState} from './categoryTypes';
import service from '../../services/service';
import {RootState} from '../reducer';
import {IRootCategory, ITag} from '../../typings/FetchData';

interface ICategoryActions extends IBaseActions {
  setTags: (tags: ITag[]) => any;
}

const init: ICategoryState = {
  data: [],
  error: null,
  isLoading: false,
  tags: [],
};

const creator = new CreatorReducer<ICategoryActions, ICategoryState>(
  'category',
);
creator.addAction('setTags', (state, action) => {
  return {...state, tags: action.payload};
});
const actionsCategory = creator.createActions();

const thunkGetCustomCategories = async (
  dispatch: any,
  getStore: () => RootState,
) => {
  dispatch(actionsCategory.setLoading(false));
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
      dispatch(actionsCategory.setData(data));
    }
  } catch (e) {
    dispatch(actionsCategory.setError(e));
  } finally {
    dispatch(actionsCategory.setLoading(false));
  }
};

const thunkGetTags = async (dispatch: any) => {
  service
    .getTags()
    .then((res) => {
      if (res.success) {
        dispatch(actionsCategory.setTags(res.data));
      }
    })
    .catch((e) => {});
};

const selectorCategory = {
  getCustomCategories: (state: RootState) => state.category.data,
  getError: (state: RootState) => state.category.error,
  getRestaurant: (state: RootState) => {
    if (state.category.data.length > 0) {
      return state.category.data[0].children || [];
    }
    return [];
  },
  getShop: (state: RootState) => {
    if (state.category.data.length > 0) {
      return state.category.data[1].children || [];
    }
    return [];
  },
  getTags: (state: RootState) => {
    if (state.category.tags.length > 0) {
      return state.category.tags;
    }
    return [];
  },
  getRootId: (id: number) => (state: RootState) => {
    const root = state.category.data.find((r) =>
      r.children.some((c) => c.id === id),
    )!;
    return root.id;
  },
  getFirstCategory: (id: number) => (state: RootState) => {
    if (state.category.data.length === 0) return null;
    const findItem = state.category.data.find((c) => c.id === id);
    if (findItem) {
      return findItem.children[0].id;
    }
    return null;
  },
  getNameCategory: (id: number) => (state: RootState) => {
    for (let root of state.category.data) {
      for (let c of root.children) {
        if (c.id === id) {
          return c.name;
        }
      }
    }
    return '';
  },
};

export {
  actionsCategory,
  thunkGetCustomCategories,
  selectorCategory,
  thunkGetTags,
};
export default creator.createReducerFetch(init);
