const dot = require('dot');

const compile = (code, data, name) => {
  let codeString = code;
  try {
    const tmpl = dot.template(code, {argName: Object.keys(data)});
    codeString = tmpl(data);
  } catch (e) {
    console.log(`%c Error generating ${name}: ${e.message}`, 'color: red');
  }
  return codeString;
};

const template = { compile };

export default template;
