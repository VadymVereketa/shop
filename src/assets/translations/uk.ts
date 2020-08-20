const uk = {
  tabBarRestaurant: 'Ресторан',
  tabBarShop: 'Магазин',
  tabBarTagProducts: 'Пропозиції',
  tabBarMenu: 'Більше',

  btnOrder: 'замовити',
  btnOrderLong: 'оформити замовлення',
  btnAddToCart: 'Додати в кошик',
  btnHasInCart: 'В кошику',

  productInfo:
    'Остаточна вага товару і сума буде відома після зважування і розділки.',
  productDesc:
    'При оформленні замовлення і безготівкового розрахунку кошти попередньо будуть списання депозитом за %{weight}. У разі меншої ваги товару, гроші будуть повернуті протягом доби на Вашу карту.',

  profileLogin: 'Увiйдiть',
  profileSignUp: 'Реєстрація',
  profileTitle: 'Профіль',
  profileMyOrders: 'Мої замовлення',
  profileSettings: 'Налаштування',
  profileLocations: 'Локації',
  profileCall: 'Дзвони з',

  cartTitle: 'Кошик',
  cartEmptyItems: 'Кошик порожній',
  cartSum: 'Сума за замовлення',
  cartAddComment: 'Додати коментар',
  cartComment: 'Коментар',

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
