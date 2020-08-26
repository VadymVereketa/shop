import {getWithoutCodePhone} from './normalizePhone';

const validOnMask = (value: string) => value && value.indexOf('_') === -1;

const validation = {
  repeatPassword: (value1) => ({
    validate: (value) => {
      return value.toString() === value1.toString() || 'Паролі не співпадають';
    },
    required: "Обов'язкове поле",
  }),
  maskNumber: {
    validate: (value) => {
      return validOnMask(value) ? undefined : 'Неправильний номер картки';
    },
  },
  maskCVV: {
    validate: (value: string) => {
      return value.length !== 3 ? 'Поле "CVV" необхідно заповнити.' : undefined;
    },
  },
  maskDate: {
    validate: (value) => {
      const res = validOnMask(value);
      if (!res) return 'Поле "ММ/РР" необхідно заповнити.';

      const date = new Date();
      const month = date.getMonth() + 1;
      const year = +(date.getFullYear() + '').substr(2);

      const [m, y] = value.split('/').map((v) => +v);
      if (y < year || (m <= 0 && m >= 13)) {
        return 'Неправильний термін дії картки';
      }
      if (y === year && m < month) {
        return 'Неправильний термін дії картки';
      }
      return undefined;
    },
  },
  password: {
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/,
      message: 'Це не коректний пароль. Введіть правильний',
    },
    required: {
      message: "Обов'язкове поле",
      value: true,
    },
  },
  name: {
    required: "Обов'язкове поле",
  },
  surname: {
    required: "Обов'язкове поле",
  },
  phone: {
    validate: (value) => {
      if (getWithoutCodePhone(value) === '') return "Обов'язкове поле";
      return validOnMask(value)
        ? undefined
        : 'Введіть коректний номер телефону';
    },
  },
  onlyNumber: {
    validate: (value) => {
      return isNaN(Number(value)) ? 'Повино бути число' : undefined;
    },
  },
  email: {
    pattern: {
      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Введіть коректний e-mail',
    },
  },
  required: {
    required: {
      message: "Обов'язкове поле",
      value: true,
    },
  },
};

export default validation;
