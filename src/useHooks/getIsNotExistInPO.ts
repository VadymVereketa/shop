import {ICartItem} from '../typings/FetchData';

const getIsNotExistInPO = (items: ICartItem[], id: number) => {
  return items.some((item) => {
    const {product} = item;

    if (
      product.productOptions.some((po) => {
        return !po.available;
      })
    ) {
      return true;
    }
    return product.productOptions.every((po) => {
      return po.sellPoint.id !== id;
    });
  });
};

export default getIsNotExistInPO;
