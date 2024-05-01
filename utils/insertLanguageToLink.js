module.exports = (link, language) => {
  if (!link || typeof link != 'string')
    return '/';

  let add_https = false;
  if (link.includes('https://'))
    add_https = true;

  const link_clean = (add_https ? 'https://' : '') + link.replace('https://', '').split('/').join('/');

  if (!language || typeof language != 'string' || !language.trim().length)
    return link_clean;

  if (link_clean.includes('?')) {
    if (link_clean.split('?').length < 2)
      return link_clean.split('?')[0] + '?lang=' + language

    const params = link.split('?')[1].split('&').filter(each => !each.includes('lang=')).join('&');

    return link_clean.split('?')[0] + '?lang=' + language + (params.length ? '&' + params : '');
  } else
    return link_clean + '?lang=' + language;
};