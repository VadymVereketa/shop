export const getWithoutCodePhone = (phone: string) => {
  return phone
    .replace('+', '')
    .replace('(', '')
    .replace(')', '')
    .replace(/\s/g, '');
};

export const getWithCodePhone = (phone: string) => {
  phone = getWithoutCodePhone(phone);
  if (phone.startsWith('38')) {
    phone = phone.replace('38', '');
  }
  return `+38(${phone.substr(0, 3)}) ${phone.substr(3, 3)} ${phone.substr(
    6,
    2,
  )} ${phone.substr(8, 2)}`;
};

export const getIsCustomPhone = (phone: string) => {
  // true - foreign, false - UA
  return !phone.replace('+', '').replace('(', '').trim().startsWith('380');
};

export const formatPhone = (phone: string, isCustomPhone: boolean = false) => {
  if (!isCustomPhone) {
    isCustomPhone = getIsCustomPhone(phone);
  }
  const format = new Intl.NumberFormat('uk', {
    useGrouping: true,
  });
  return isCustomPhone
    ? format.format(+getWithoutCodePhone(phone))
    : getWithCodePhone(phone);
};
