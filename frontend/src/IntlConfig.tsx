// import { useUser } from '@esgmax/lib.hooks/user';
import React, { useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';

import itMessages from './lang/it.json'
import enMessages from './lang/en.json'

export const IntlConfig = (props: React.HTMLAttributes<HTMLDivElement>) => {
  // const user = useUser()
  const [messages, setmessages] = useState({});

  const [locale, setLocale] = useState('it');

  useMemo(() => {
    const getUserLanguage = () => {
      // if (user?.languageId) {
      //   return user.languageId;
      // }
      // const browserLanguage = navigator.language || 'it'; // Fallback to 'it' if browser language is not available
      const browserLanguage = 'it'; // Fallback to 'it' if browser language is not available
      return browserLanguage.split('-')[0]; // Use only the primary language subtag
    };

    const userLanguage = getUserLanguage();

    const loadMessages = async (lang: string) => {
      switch (lang) {
        case 'en':
          setmessages(enMessages);
          break;
        case 'it':
        default:
          setmessages(itMessages);
          break;
      }
      setLocale(lang);
    };

    loadMessages(userLanguage);
  }, []) // Removed user dependency since it's not used

  return (
    <IntlProvider messages={messages} locale={locale}>
      {props.children}
    </IntlProvider>
  );
}