import {useSelector} from 'react-redux';
import {TypeDelivery} from '../constants/constantsId';
import {selectorsCart} from '../redux/cart/cartReducer';
import {selectorsOrder} from '../redux/order/orderReducer';
import {IProduct} from '../typings/FetchData';

const useAvailableProduct = (currentIdSellPoint?: number) => {
  const reduxIdSellPoint = useSelector(selectorsCart.getIdSellPoint);
  const deliverType = useSelector(selectorsOrder.getDeliveryType);

  return (product: IProduct) => {
    let idSellPoint;
    if (deliverType && deliverType.code === TypeDelivery.courier) {
      const deliveryOptions = product.deliveryOptions || [];
      if (deliveryOptions.length > 0) {
        return deliveryOptions[0].available;
      }
      return false;
    }
    if (deliverType && deliverType.code === TypeDelivery.self) {
      idSellPoint = reduxIdSellPoint!;
    }
    if (currentIdSellPoint) {
      idSellPoint = currentIdSellPoint;
    }

    const po = product.productOptions.find(
      (po) => po.available && po.sellPoint.id == idSellPoint,
    );
    if (po) {
      if (po.available) {
        if (po.price != '0') {
          return true;
        }
      }
    }
    return false;
  };
};

export default useAvailableProduct;
