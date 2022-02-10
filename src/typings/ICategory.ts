import ICDNImage from './ICDNImage';
import {IImage} from './IImage';

export interface IBaseCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  ord: number;
}

export interface IFetchCategory extends IBaseCategory {
  seoText: string | null;
  parent: IBaseCategory | null;
  categoryImages: IImage | null;
  children: IFetchCategory[];
  cdnImage: ICDNImage | null;
}

export interface ITreeCategory {
  [id: string]: IFetchCategory;
}
