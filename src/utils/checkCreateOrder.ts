import {IProduct} from '../typings/FetchData';

export const checkCreateOrder = (products: IProduct[]) => {
  if (products.length === 0) {
    return false;
  }
  for (let p of products) {
    if (p.productOptions.length === 0) {
      return false;
    }
    if (p.productOptions.every((po) => !po.available)) {
      return false;
    }
  }
  return true;
};
