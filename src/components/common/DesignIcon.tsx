import React from 'react';
const RestaurantIcon = require('../../assets/svg/ic-restaurant.svg').default;
const StoreIcon = require('../../assets/svg/ic-store.svg').default;
const EyeIcon = require('../../assets/svg/ic-eye.svg').default;
const MapIcon = require('../../assets/svg/ic-map.svg').default;
const MenuMoreIcon = require('../../assets/svg/ic-menu-more.svg').default;
const ArrowIcon = require('../../assets/svg/ic-arrow.svg').default;
const ArrowRightIcon = require('../../assets/svg/ic-arrow-right.svg').default;
const CheckIcon = require('../../assets/svg/ic-check-mark.svg').default;
const CloseIcon = require('../../assets/svg/ic-close.svg').default;
const CopyIcon = require('../../assets/svg/ic-copy.svg').default;
const FingerprintIcon = require('../../assets/svg/ic-fingerprint.svg').default;
const LogOutIcon = require('../../assets/svg/ic-log-out.svg').default;
const NextIcon = require('../../assets/svg/ic-next.svg').default;
const OpenEyeIcon = require('../../assets/svg/ic-open-eye.svg').default;
const PhoneIcon = require('../../assets/svg/ic-phone.svg').default;
const SaleIcon = require('../../assets/svg/ic-sale.svg').default;
const SearchIcon = require('../../assets/svg/ic-search.svg').default;
const ShareIcon = require('../../assets/svg/ic-share.svg').default;
const StarEmptyIcon = require('../../assets/svg/ic-star-empty.svg').default;
const StarFillIcon = require('../../assets/svg/ic-star-filled.svg').default;

type IName =
  | 'restaurant'
  | 'store'
  | 'eye'
  | 'map'
  | 'menu-more'
  | 'arrow'
  | 'arrow-right'
  | 'check-mark'
  | 'close'
  | 'copy'
  | 'fingerprint'
  | 'log-out'
  | 'next'
  | 'open-eye'
  | 'phone'
  | 'sale'
  | 'search'
  | 'share'
  | 'star-empty'
  | 'star-filled';

const getIcon = (name: IName) => {
  switch (name) {
    case 'arrow':
      return ArrowIcon;
    case 'arrow-right':
      return ArrowRightIcon;
    case 'check-mark':
      return CheckIcon;
    case 'close':
      return CloseIcon;
    case 'copy':
      return CopyIcon;
    case 'fingerprint':
      return FingerprintIcon;
    case 'log-out':
      return LogOutIcon;
    case 'next':
      return NextIcon;
    case 'open-eye':
      return OpenEyeIcon;
    case 'phone':
      return PhoneIcon;
    case 'sale':
      return SaleIcon;
    case 'search':
      return SearchIcon;
    case 'share':
      return ShareIcon;
    case 'star-empty':
      return StarEmptyIcon;
    case 'star-filled':
      return StarFillIcon;
    case 'restaurant':
      return RestaurantIcon;
    case 'store':
      return StoreIcon;
    case 'eye':
      return EyeIcon;
    case 'map':
      return MapIcon;
    case 'menu-more':
      return MenuMoreIcon;
  }
};

interface IDesignIconProps {
  name: IName;
  size: number;
  fill?: string;
  fillOpacity?: number;
  rotation?: number;
  fillRule?: 'nonzero' | 'evenodd';
  stroke?: 'stroke' | string;
  strokeWidth?: number;
  strokeOpacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  origin?: number;
  originX?: number;
  originY?: number;
}
const DesignIcon = ({name, size, ...props}: IDesignIconProps) => {
  const Icon = getIcon(name);
  return <Icon width={size} height={size} {...props} />;
};

export default DesignIcon;
