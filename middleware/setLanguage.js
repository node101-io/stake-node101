const i18n = require('i18n');
const path = require('path');

const insertLanguageToLink = require('../utils/insertLanguageToLink');

const DEFAULT_PAGE_LANGUAGE = 'en';
const SUPPORTED_PAGE_LANGUAGES = ['tr', 'en'];

i18n.configure({
  locales: SUPPORTED_PAGE_LANGUAGES,
  directory: path.join(__dirname, '..', 'translations'),
  queryParameter: 'lang',
  defaultLocale: DEFAULT_PAGE_LANGUAGE
});

module.exports = (req, res, next) => {
  res.locals.page_lang = req.query.lang || req.acceptsLanguages(...SUPPORTED_PAGE_LANGUAGES) || DEFAULT_PAGE_LANGUAGE;

  if (req.query.lang)
    res.locals.lang = req.query.lang;

  res.locals.insertLanguageToLink = insertLanguageToLink;

  i18n.init(req, res, next);
};