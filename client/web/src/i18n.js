import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from "../src/assets/i18n/translations/en.json";
import translationTR from "../src/assets/i18n/translations/tr.json";

//const options = {
//    order: ['querystring', 'navigator'],
//    lookupQuerystring: 'lng'
//}

const resources = {
    en: {
        translation: translationEN
    },
    tr: {
        translation: translationTR
    }
};


// UYGUN DİLLER : [en,tr]

const getDefaultLanguage = localStorage.getItem("lang") || 'tr'

if (getDefaultLanguage === "tr") {
    import('moment/locale/tr')
}
else {
    import('moment/locale/en-au')
}

i18n
    .use(initReactI18next)
    .init({

        resources,
        lng: getDefaultLanguage,
        fallbackLng: "tr",
        interpolation: {
            escapeValue: false
        },
        debug: false,


    })

export default i18n




//  .init({
//      // resources,
//      lng: getDefaultLanguage,
//      // backend: {
//      //     /* translation file path */
//      //     loadPath: '${HOST_URL}/assets/i18n/{{ns}}/{{lng}}.json'
//      // },
//      resources: {
//          en: {
//              translation: {
//                  "Welcome to React": "Welcome to React and react-i18next"
//              }
//          }
//      },
//      fallbackLng: 'tr',
//      // fallbackLng: ['tr', 'en'],
//      //  detection: options,
//      debug: true,
//      /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
//      ns: 'translations',
//      defaultNS: 'translations',
//      keySeparator: false,
//      interpolation: {
//          escapeValue: false,
//          formatSeparator: ','
//      },
//      react: {
//          wait: true
//      },
//
//      // // cache user language on
//      // caches: ['localStorage', 'cookie'],
//      // excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
//      // // optional expire and domain for set cookie
//      // cookieMinutes: 10,
//      // cookieDomain: '/',
//      // // optional htmlTag with lang attribute, the default is:
//      // htmlTag: document.documentElement,
//      // // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
//      // cookieOptions: { path: '/', sameSite: 'strict' },
//      // supportedLngs: ['tr', 'en'],
//
//  })
//
//
