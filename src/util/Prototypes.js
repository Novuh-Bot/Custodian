String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.toPlural = function() {
  return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
};
  
String.prototype.format = function() {
  let content = this;
  for (let i = 0; i < arguments.length; i++) {
    const target = '{' + i + '}';
    content = content.split(target).join(String(arguments[i]));
    content = content.replace('{}', String(arguments[i]));
  }
  return content;
};

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};