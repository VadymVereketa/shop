import t from '../utils/translate';
import {IVariant} from './IVariant';

enum TypeSortProduct {
  askPrice = 'cheap',
  descPrice = 'expensive',
}

const useGetOptionsSortProduct = () => {
  const options: IVariant<string, TypeSortProduct>[] = [
    {
      label: t('cheapSort'),
      value: TypeSortProduct.askPrice,
    },
    {
      label: t('expensiveSort'),
      value: TypeSortProduct.descPrice,
    },
  ];

  return options;
};

const getSortFilter = (type?: TypeSortProduct | null) => {
  if (!type || type === null) {
    return undefined;
  }

  switch (type) {
    case TypeSortProduct.askPrice:
      return 'productOptions/price asc';
    case TypeSortProduct.descPrice:
      return 'productOptions/price desc';
  }
};

export {useGetOptionsSortProduct, getSortFilter};
export default TypeSortProduct;
