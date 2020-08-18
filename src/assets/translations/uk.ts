const uk = {
  tabBarRestaurant: 'Ресторан',
  tabBarShop: 'Магазин',
  tabBarTagProducts: 'Пропозиції',
  tabBarMenu: 'Більше',

  btnOrder: 'замовити',

  profileLogin: 'Увiйдiть',
  profileSignUp: 'Реєстрація',
  profileTitle: 'Профіль',
  profileMyOrders: 'Мої замовлення',
  profileSettings: 'Налаштування',
  profileLocations: 'Локації',
  profileCall: 'Дзвони з',

  loginWelcome1: 'Вітаємо в Egersund,',
  loginWelcome2: 'з поверненням!',
  loginForgetPassword: 'Забув пароль?',
  loginSubmit: 'Увійти',
  loginNoAccount: 'Немає аккаунту? Реєстрація',

  signUpWelcome: 'Вітаємо Вас в Egersund!',
  signUpSubmit: 'Зареєструватися',
  signUpYesAccount: 'У мене є аккаунт! Увійти',

  //text input
  tIPhoneLabel: 'Мобільний телефон',
  tIPhonePlaceholder: 'Введіть мобільний телефон',

  tIPasswordLabel: 'Введіть пароль',
  tIPasswordPlaceholder: 'Введіть пароль',

  tINameLabel: "Ім'я",
  tINamePlaceholder: "Введіть ім'я",

  tiSearchPlaceholder: 'Що ви шукайте сьогодні?',
  //text input

  checkPasswordMinLength: '8-м сімволів',
  checkPasswordLowerCase: 'прописна буква',
  checkPasswordMUpperCase: 'велика буква',
} as const;

export type ITranslate = keyof typeof uk;

export default uk;
