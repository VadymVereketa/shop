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

export {ICDNVariantKey};
export default ICDNImage;
