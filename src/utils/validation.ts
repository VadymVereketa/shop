import t from './translate';

const useValidation = () => {
  const validation = {
    email: {
      pattern: {
        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: t('errorEmail'),
      },
    },
    required: {
      pattern: {
        value: /\S+/,
        message: t('errorRequired'),
      },
      validate: (value: string) => {
        if (!value) {
          return t('errorRequired');
        }
        return undefined;
      },
    },
    firstName: {
      pattern: {
        value: /\S+/,
        message: t('errorRequired'),
      },
      validate: (value: string) => {
        const error = t('errorFirstName');
        if (!value) {
          return t('errorRequired');
        }

        const match = value.match(/[^\p{L}\s]/u);

        return match === null ? undefined : error;
      },
    },
    lastName: {
      validate: (value: string) => {
        const error = t('errorLastName');
        const match = value.match(/[^\p{L}\s]/u);

        return match === null ? undefined : error;
      },
    },
    onlyNumber: {
      validate: (value = '') => {
        return isNaN(Number(value)) ? t('errorNumber') : undefined;
      },
    },
  };

  return validation;
};

export default useValidation;
