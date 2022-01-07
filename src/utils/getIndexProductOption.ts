import {IProduct} from '../typings/FetchData';

export const getIndexProductOption = (
  product: Partial<IProduct>,
  idSellPoint: number | null,
) => {
  if (idSellPoint === null) {
    return 0;
  }
  try {
    let index = product!.productOptions!.findIndex(
      (p) => p.sellPoint.id === idSellPoint,
    );
    index = index === -1 ? 0 : index;
    return index;
  } catch (e) {
    return 0;
  }
};
