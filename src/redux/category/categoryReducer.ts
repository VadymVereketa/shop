import {CreatorReducer} from '../base/base';
import {IBaseActions} from '../base/baseTypes';
import {ICategoryState} from './categoryTypes';
import service from '../../services/service';
import {RootState} from '../reducer';
import {IRootCategory, ITag} from '../../typings/FetchData';
import {IFetchCategory, ITreeCategory} from '../../typings/ICategory';

interface ICategoryActions extends IBaseActions {
  setTags: (tags: ITag[]) => any;
  setDataItem: (o: Partial<ICategoryState>) => any;
}

const init: ICategoryState = {
  data: [
    {
      id: 1,
      name: 'Ресторан',
      description: 'Ресторан',
      ord: 0,
      children: [
        {
          id: 5,
          name: 'Суші та Роли',
          description: 'Суші та Роли',
          ord: 1,
          parentId: 1,
          img: '95cc296c-a0ad-4e5f-aa41-8929abcd8701.png',
        },
        {
          id: 8,
          name: 'Супи',
          description: 'Супи',
          ord: 3,
          parentId: 1,
          img: 'a731037b-2a7b-4a2d-a626-25636bea450a.png',
        },
        {
          id: 4,
          name: 'Сандвічі',
          description: 'Сандвічі',
          ord: 3,
          parentId: 1,
          img: '4dd8c989-c759-4dc1-b9e6-d4a746a1b76c.png',
        },
        {
          id: 6,
          name: 'Гриль',
          description: 'Гриль',
          ord: 5,
          parentId: 1,
          img: '1d705bd2-58c2-4521-96da-743fd23fcd3e.png',
        },
        {
          id: 10,
          name: 'Гарніри',
          description: 'Гарніри',
          ord: 8,
          parentId: 1,
          img: '146d7519-7b28-424e-be79-cbb59c460a26.png',
        },
        {
          id: 19,
          name: 'Солодкі страви',
          description: 'Солодкі страви',
          ord: 10,
          parentId: 1,
          img: 'd08e51ae-3158-4289-8ee8-45515ba36e3c.png',
        },
        {
          id: 7,
          name: 'Напої',
          description: 'Напої',
          ord: 23,
          parentId: 1,
          img: 'f7945629-c458-4308-a98c-52736a1c39dc.png',
        },
        {
          id: 9,
          name: 'Соуси',
          description: 'Соуси',
          ord: 99,
          parentId: 1,
          img: 'ce666818-0b29-47cb-88f1-ed0a4262539e.png',
        },
      ],
    },
    {
      id: 2,
      name: 'Магазин',
      description: 'Магазин',
      ord: 1,
      children: [
        {
          id: 13,
          name: 'Охолоджені морепродукти',
          description: 'Охолоджені морепродукти',
          ord: 1,
          parentId: 2,
          img: '3d2ad73e-988d-4890-b5a8-68d315f0519d.png',
        },
        {
          id: 12,
          name: 'Ікра',
          description: 'Ікра',
          ord: 2,
          parentId: 2,
          img: 'afd6e0de-b46c-4cd6-b343-96d56e204c56.png',
        },
        {
          id: 14,
          name: 'Бочкова солона риба',
          description: 'Бочкова солона риба',
          ord: 2,
          parentId: 2,
          img: '11703799-cffa-40b3-bccc-0ccd3368909e.png',
        },
        {
          id: 17,
          name: 'Заморожені морепродукти',
          description: 'Заморожені морепродукти',
          ord: 3,
          parentId: 2,
          img: '58f38b46-2aab-4524-ac7d-a4f1d6b27c47.png',
        },
        {
          id: 16,
          name: 'Гастрономія',
          description: 'Гастрономія',
          ord: 6,
          parentId: 2,
          img: 'a229b12c-9599-4ff4-b354-bafe2feca7d8.png',
        },
        {
          id: 15,
          name: 'Копчена риба',
          description: 'Копчена риба',
          ord: 7,
          parentId: 2,
          img: '4d8ca876-6745-4ccd-8ac4-481d4bb8e7aa.png',
        },
        {
          id: 18,
          name: 'Хліб власного виробництва',
          description: 'Хліб власного виробництва',
          ord: 12,
          parentId: 2,
          img: '2b58d58d-5af9-427a-8803-8d51d8caa64e.png',
        },
        {
          id: 20,
          name: 'Рибна бакалія',
          description: 'Рибна бакалія',
          ord: 14,
          parentId: 2,
          img: '4185e35a-4fdc-45ff-8803-e82b4242711b.png',
        },
      ],
    },
  ],
  error: null,
  isLoading: false,
  tags: [],
  rootsCategory: [],
  treeCategories: {},
};

const creator = new CreatorReducer<ICategoryActions, ICategoryState>(
  'category',
);
creator.addAction('setTags', (state, action) => {
  return {...state, tags: action.payload};
});
creator.addAction('setDataItem', (state, action) => {
  return {...state, ...action.payload};
});
const actionsCategory = creator.createActions();

const serviceGetCustomCategories = async (dispatch: any) => {
  const res = await service.getCustomCategories();
  const rootsCategory = res
    .filter((c) => c.parent === null)
    .sort((a, b) => a.ord - b.ord);
  const result: ITreeCategory = {};

  res.forEach((c) => {
    result[c.id] = c;
  });

  res.forEach((c) => {
    if (c.parent) {
      const category = result[c.parent.id];
      if (category.children) {
        category.children.push(c);
      } else {
        category.children = [c];
      }
    }
  });

  res.forEach((c) => {
    const category = result[c.id];
    if (category.children) {
      category.children.sort((a, b) => a.ord - b.ord);
    }
  });

  dispatch(
    actionsCategory.setDataItem({
      rootsCategory,
      treeCategories: result,
    }),
  );
};

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
  getTagsIds: (state: RootState) => {
    if (state.category.tags.length > 0) {
      return state.category.tags.map((t) => t.id);
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

const selectorCategory2 = {
  getCategories: (state: RootState) => state.category.treeCategories,
  getRootCategories: (state: RootState) => {
    const roots = state.category.rootsCategory;
    return roots.map((r) => state.category.treeCategories[r.id]);
  },
  getCategoriesById: (id: any) => (state: RootState) =>
    state.category.treeCategories[id],
  getDeepCategoriesById: (id: any) => (state: RootState) => {
    const root = selectorCategory2.getCategoriesById(id)(state);
    let result: IFetchCategory[] = [];

    const getChildren = (category: IFetchCategory) => {
      if (category.children) {
        result = [...result, ...category.children];
        category.children.forEach((c) => getChildren(c));
      }
    };
    getChildren(root);
    return result;
  },
  getRootCategory: (id: any) => (state: RootState) => {
    let category = state.category.treeCategories[id];
    let parent = category.parent;
    while (parent !== null) {
      category = state.category.treeCategories[parent.id];
      parent = category.parent;
    }
    return category;
  },
  getChainsCategories: (id: any) => (state: RootState) => {
    const res = [state.category.treeCategories[id]];
    let parent = res[0].parent;

    while (parent !== null) {
      const category = state.category.treeCategories[parent.id];
      res.unshift(category);
      parent = category.parent;
    }

    return res;
  },
  hasCategory: (innerCategory: any, outerCategory: any) => (
    state: RootState,
  ) => {
    if (innerCategory === outerCategory) {
      return true;
    }
    let category = state.category.treeCategories[innerCategory];
    let parent = category.parent;
    while (parent !== null) {
      category = state.category.treeCategories[parent.id];
      parent = category.parent;
      if (category.id === innerCategory) {
        return true;
      }
    }
    return false;
  },
  getSelfIdOrChildrenIds: (id: any) => (state: RootState) => {
    const category = state.category.treeCategories[id];
    if (category.children) {
      const res = category.children.map((c) => c.id);
      res.push(id);
      return res;
    }
    return category.id;
  },
  isFirstLevelCategory: (id: any) => (state: RootState) => {
    const category = state.category.treeCategories[id].parent;
    const roots = state.category.rootsCategory;

    if (category === null) {
      return false;
    }

    return roots.some((r) => r.id === category.id);
  },

  getIdsCategory: (id: any) => (state: RootState) => {
    if (!id || id === -1) {
      return id;
    }
    if (state.config.isNewCategory) {
      const root = state.category.treeCategories[id];

      let result: number[] = [];

      const getChildren = (category: IFetchCategory) => {
        if (category.children) {
          category.children.forEach((c) => getChildren(c));
        } else {
          result.push(category.id);
        }
      };
      getChildren(root);
      return result;
    } else {
      return id;
    }
  },
};

export {
  actionsCategory,
  thunkGetCustomCategories,
  selectorCategory,
  selectorCategory2,
  thunkGetTags,
  serviceGetCustomCategories,
};
export default creator.createReducerFetch(init);
