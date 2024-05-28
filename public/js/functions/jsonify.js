module.exports = (data) => {
    try {
      return JSON.parse(data || '{}');
    } catch (err) {
      console.log(err);
      return null;
    };
  };