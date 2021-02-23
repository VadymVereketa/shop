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
  return `+38 ${phone.substr(0, 3)} ${phone.substr(3, 3)} ${phone.substr(
    6,
    2,
  )} ${phone.substr(8, 2)}`;
};

export const getIsCustomPhone = (phone: string) => {
  // true - foreign, false - UA
  return !phone
    .replace('+', '')
    .replace(/\s/g, '')
    .replace('(', '')
    .trim()
    .startsWith('380');
};

const getCustomFormatPhone = (phone: string) => {
  phone = getWithoutCodePhone(phone);

  let strs: string[] = [];
  let start = 0;

  const splits = [2, 3, 3, 2, 2];
  if (phone) {
    for (let split of splits) {
      if (start > phone.length) {
        break;
      }
      strs.push(
        start === 0
          ? '+' + phone.substr(start, split)
          : phone.substr(start, split),
      );
      start += split;
    }

    return strs.join(' ');
  }

  return phone;
};

export const formatPhone = (phone: string, isCustomPhone: boolean = false) => {
  if (!isCustomPhone) {
    isCustomPhone = getIsCustomPhone(phone);
  }

  return isCustomPhone ? getCustomFormatPhone(phone) : getWithCodePhone(phone);
};
