import {IProduct} from '../typings/FetchData';

export const getIndexProductOption = (
  product: Partial<IProduct>,
  idSellPoint: number,
) => {
  try {
    let index = product!.productOptions!.findIndex(
      (p) => p.sellPoint.id === idSellPoint,
    );
    index = index === -1 ? 0 : index;
    return index;
  } catch (e) {
    return -1;
  }
};
