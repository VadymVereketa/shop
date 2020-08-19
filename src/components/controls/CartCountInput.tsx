import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ICartItem} from '../../typings/FetchData';
import {ID_UNIT_WEIGHT} from '../../constants/constantsId';
import {actionsCart} from '../../redux/cart/cartReducer';
import CountInput from './CountInput';

interface ICartCountItemProps {
  item: ICartItem;
}
const CartCountItem = React.memo(({item}: ICartCountItemProps) => {
  const dispatch = useDispatch();
  const {product} = item;
  const isWeight = product.units === ID_UNIT_WEIGHT;

  const onChange = (count) => {
    if (item.alternativeCount === null) {
      dispatch(
        actionsCart.changeCount({
          count,
          id: product.id,
        }),
      );
    } else {
      dispatch(
        actionsCart.changeCount({
          count: count * +item.product.avgWeight!,
          id: product.id,
        }),
      );
      dispatch(
        actionsCart.changeAlternativeCount({
          count,
          id: product.id,
        }),
      );
    }
  };

  const count =
    item.alternativeCount !== null ? +item.alternativeCount : +item.count;

  return (
    <CountInput
      isEditable={true}
      isWeightUnit={item.alternativeCount !== null ? false : isWeight}
      onChange={onChange}
      value={count}
      style={{maxWidth: '50%'}}
    />
  );
});

export default CartCountItem;
