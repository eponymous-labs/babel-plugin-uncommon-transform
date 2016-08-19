'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      CallExpression: function CallExpression(path) {
        if (t.isIdentifier(path.node.callee, { name: "require" }) // detect require() expressions 
        && !path.scope.getBinding('require') && // where "require" isn't bound to a variable
        path.node.arguments.length == 1 && // with one argument
        t.isStringLiteral(path.node.arguments[0])) {
          // which is a string literal

          var module = path.node.arguments[0].value;
          // find the parent program
          var program = path.findParent(function (node) {
            return t.isProgram(node);
          });
          // generate an identifier which doesn't clash with anything
          var id = program.scope.generateUidIdentifier(module);
          path.replaceWith(id);

          // create an import declaration
          program.unshiftContainer('body', t.importDeclaration([t.importNamespaceSpecifier(id)], t.stringLiteral(module)));
        }
      }
    }
  };
};

