module.exports = (req, res) => {
  if (!req.body.keys || !Array.isArray(req.body.keys) || !req.body.keys.length)
    return res.json({ error: 'bad_request' });

  const items = {};

  req.body.keys.forEach(key => {
    if (!key || typeof key != 'string' || !key.trim().length)
      return;

    items[key.trim()] = req.session[key.trim()];
  });

  if (!Object.keys(items).length)
    return res.json({ err: 'bad_request' });

  return res.json({ data: items });
};