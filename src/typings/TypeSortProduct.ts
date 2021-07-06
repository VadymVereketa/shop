import {IVariant} from './IVariant';

enum TypeSortProduct {
  askPrice = 'cheap',
  descPrice = 'expensive',
}

const useGetOptionsSortProduct = () => {
  const options: IVariant<string, TypeSortProduct>[] = [
    {
      label: 'дешевше спочатку',
      value: TypeSortProduct.askPrice,
    },
    {
      label: 'дорожче спочатку',
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
