const globals = {};

exports.set = (key, value) => {
  globals[key] = value;
};

exports.get = key => globals[key];
