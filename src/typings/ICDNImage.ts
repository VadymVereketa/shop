import getUrlImg from '../utils/getUrlImg';
import {cdnUrlRef} from '../utils/navigationRef';
import {IProduct, ISellPoint} from './FetchData';
import {IFetchCategory} from './ICategory';

interface ICDNImage {
  filename: string;
  id: number;
  isSigned: boolean;
  metadata: null;
  uid: string;
  uploaded: string;
  variants: {
    [name: string]: string;
  };
}

enum ICDNVariantKey {
  '75x50' = '75x50',
  '150x100' = '150x100',
  '250x150' = '250x150',
  '400x300' = '400x300',
  '550x300' = '550x300',
  '600x450' = '600x450',
  '800x600' = '800x600',
  '900x600' = '900x600',
  '1200x900' = '1200x900',
  'mock' = 'mock',
  'origin' = 'origin',
}

const getCDNKeyBySize = (size: number) => {
  const arr = [75, 150, 250, 400, 550, 600, 800, 900, 1200, 1920];
  const res = arr.find((a) => a >= size);
  if (res) {
    if (res === 1920) {
      return ICDNVariantKey.origin;
    }

    for (let enumMember in ICDNVariantKey) {
      if (enumMember.startsWith(res.toString())) {
        return enumMember;
      }
    }
  }
  return ICDNVariantKey.origin;
};

const categoryImage = (category: IFetchCategory, key: ICDNVariantKey) => {
  if (category.cdnImage) {
    const url = cdnUrlRef.current + category.cdnImage.uid + '/' + key;
    return {
      uri: url,
    };
  }

  return getUrlImg(category.categoryImages);
};

const sellPointImage = (sellPoint: ISellPoint, key: ICDNVariantKey) => {
  if (sellPoint.cdnImage) {
    const url = cdnUrlRef.current + sellPoint.cdnImage.uid + '/' + key;
    return {
      uri: url,
    };
  }

  return getUrlImg(sellPoint.sellPointImage);
};

const productImage = (product: IProduct, key: ICDNVariantKey) => {
  if (product.cdnImages && product.cdnImages.length > 0) {
    const cdnImage = product.cdnImages[0];
    const url = cdnUrlRef.current + cdnImage.uid + '/' + key;
    return {
      uri: url,
    };
  }

  const productImages = product.productImages ?? [];

  return getUrlImg(productImages.length > 0 ? productImages[0] : null);
};

export {
  ICDNVariantKey,
  categoryImage,
  sellPointImage,
  getCDNKeyBySize,
  productImage,
};
export default ICDNImage;
