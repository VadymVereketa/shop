import {IAddressRedux} from '../typings/FetchData';

export const formatAddress = (address?: IAddressRedux | any) => {
  if (!address) return '';
  const district = address.buildObj
    ? address.buildObj.extra.name
    : address.district;
  const flat = address.flatNumber ? `, кв. ${address.flatNumber}` : '';
  const entrance = address.entrance ? `, під'їзд ${address.entrance}` : '';
  return `${district || ''} ${address.street} ${
    address.buildNumber
  }${flat}${entrance}`;
};

export const getConvertDataToFetch = (
  data: IAddressRedux,
  comment?: string,
) => {
  const district = data.buildObj ? data.buildObj.extra.name : data.district;
  const addressDictionaryId = data.buildObj ? data.buildObj.value : null;
  const buildNumber = data.buildObj
    ? data.buildObj.extra.build
    : data.buildNumber;
  return {
    district,
    street: data.street,
    buildNumber,
    flatNumber: data.flatNumber,
    entrance: data.entrance,
    floor: data.floor,
    addressDictionary: {
      id: addressDictionaryId,
    },
    notes: comment,
    corps: null,
  } as any;
};
