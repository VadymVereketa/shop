import React from 'react';
import {SvgCss} from 'react-native-svg';

const Apple = require('../../assets/svg/Apple.svg').default;

const icons = {
  restaurant: require('../../assets/svg/ic-restaurant.svg').default,
  store: require('../../assets/svg/ic-store.svg').default,
  eye: require('../../assets/svg/ic-eye.svg').default,
  map: require('../../assets/svg/ic-map.svg').default,
  'menu-more': require('../../assets/svg/ic-menu-more.svg').default,
  arrow: require('../../assets/svg/ic-arrow.svg').default,
  'arrow-right': require('../../assets/svg/ic-arrow-right.svg').default,
  'arrow-down': require('../../assets/svg/ic-arrow-drop.svg').default,
  'check-mark': require('../../assets/svg/ic-check-mark.svg').default,
  close: require('../../assets/svg/ic-close.svg').default,
  close2: require('../../assets/svg/ic-close-copy-2.svg').default,
  copy: require('../../assets/svg/ic-copy.svg').default,
  fingerprint: require('../../assets/svg/ic-fingerprint.svg').default,
  'log-out': require('../../assets/svg/ic-log-out.svg').default,
  next: require('../../assets/svg/ic-next.svg').default,
  'open-eye': require('../../assets/svg/ic-open-eye.svg').default,
  phone: require('../../assets/svg/ic-phone.svg').default,
  sale: require('../../assets/svg/ic-sale.svg').default,
  search: require('../../assets/svg/ic-search.svg').default,
  share: require('../../assets/svg/ic-share.svg').default,
  'star-empty': require('../../assets/svg/ic-star-empty.svg').default,
  'star-filled': require('../../assets/svg/ic-star-filled.svg').default,
  minus: require('../../assets/svg/ic-minus.svg').default,
  plus: require('../../assets/svg/ic-plus.svg').default,
  comment: require('../../assets/svg/ic-comment.svg').default,
  send: require('../../assets/svg/ic-send.svg').default,
  'menu-keb': require('../../assets/svg/ic-menu-keb.svg').default,
  reload: require('../../assets/svg/ic-reload.svg').default,
  barcode: require('../../assets/svg/ic-barcode.svg').default,
  settings: require('../../assets/svg/ic-settings.svg').default,
  UpdateApp: require('../../assets/svg/update-app.svg').default,
  logo: require('../../assets/svg/logo.svg').default,
  sort: require('../../assets/svg/ic-sort.svg').default,
  MarkerIcon: require('../../assets/svg/ic-marker.svg').default,
  HistoryOrderIcon: require('../../assets/svg/ic-history-order.svg').default,
  PaymentIcon: require('../../assets/svg/ic-payment.svg').default,
  ProfileIcon: require('../../assets/svg/ic-profile.svg').default,
};
export type IName = keyof typeof icons;

const getIcon = (name: IName) => {
  return icons[name];
};

const ignoreFill: IName[] = ['MarkerIcon', 'menu-more', 'map'];
export interface IDesignIconProps {
  name: IName;
  size: number;
  fill: string;
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

const DesignIcon = React.memo(
  ({name, size, fill, stroke, ...props}: IDesignIconProps) => {
    const Icon = getIcon(name);
    const isIgnore = ignoreFill.some((n) => n === name);
    const FILL = isIgnore ? undefined : fill;
    const STROKE = isIgnore ? fill : undefined;

    return (
      <Icon width={size} height={size} fill={FILL} stroke={STROKE} {...props} />
    );
  },
);

const AppleIcon = React.memo(({name, size, ...props}: any) => {
  return <Apple width={60} height={30} fill={'black'} />;
});

export {AppleIcon};
export default DesignIcon;
