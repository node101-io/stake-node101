const MAX_SESSION_KEY_LENGTH = 1e3;
const MAX_SESSION_VALUE_LENGTH = 1e4;

module.exports = (req, res) => {
  for (const key in req.body) {
    if (!key ||  typeof key != 'string' || !key.trim().length || key.length > MAX_SESSION_KEY_LENGTH)
      continue;

    const value = req.body[key];

    try {
      const valueString = typeof value == 'string' ? value : JSON.stringify(value);
  
      if (valueString.length > MAX_SESSION_VALUE_LENGTH)
        continue;
  
      req.session[key] = value;
    } catch (err) {
      console.log(err);
      continue;
    };
  }

  return res.json({});
};