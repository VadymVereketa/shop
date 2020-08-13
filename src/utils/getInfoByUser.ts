import {IUser} from '../typings/FetchData';
import {IReceiver} from '../redux/order/orderTypes';

export const getContactsByUser = (user: IUser | null, withUser = true) => {
  if (user === null) return null;
  const receivers: Omit<IReceiver, 'id'>[] = [];
  if (withUser) {
    receivers.push({
      name: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone,
      isPhoneCustom: user.isPhoneCustom,
    });
  }
  user.contacts &&
    user.contacts.forEach((contact) => {
      receivers.push({
        phone: contact.phone,
        name: `${contact.firstName} ${contact.lastName}`.trim(),
        isPhoneCustom: contact.isPhoneCustom,
      });
    });
  return receivers;
};

export const getAddressByUser = (user: IUser) => {
  if (user === null) return [];
  const addresses: string[] = [];
  user.addresses &&
    user.addresses.forEach((address) => {
      addresses.push(`${address.street}, ${address.buildNumber}`);
    });
  return addresses;
};

export const getCertificatesByUser = (user: IUser) => {
  const certificates: string[] = [];
  user.certificates &&
    user.certificates.forEach((c) => {
      certificates.push(c);
    });
  return certificates;
};
