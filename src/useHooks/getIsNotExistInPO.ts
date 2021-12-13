import {ICartItem} from '../typings/FetchData';

const getIsNotExistInPO = (items: ICartItem[], id: number) => {
  return items.some((item) => {
    const {product} = item;

    const productOptions = product.productOptions || [];

    if (productOptions.length === 0) {
      return true;
    }

    if (
      productOptions.some((po) => {
        return !po.available;
      })
    ) {
      return true;
    }
    return productOptions.every((po) => {
      return po.sellPoint.id !== id;
    });
  });
};

export default getIsNotExistInPO;
