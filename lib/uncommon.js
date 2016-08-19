// Copyright (c) 2016 antimatter15

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export default function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        if(t.isIdentifier(path.node.callee, { name: "require" })  // detect require() expressions 
          && !path.scope.getBinding('require') && // where "require" isn't bound to a variable
          path.node.arguments.length == 1 && // with one argument
          t.isStringLiteral(path.node.arguments[0])){ // which is a string literal

          var module = path.node.arguments[0].value;
          // find the parent program
          var program = path.findParent(node => t.isProgram(node))
          // generate an identifier which doesn't clash with anything
          var id = program.scope.generateUidIdentifier(module)
          path.replaceWith(id)

          // create an import declaration
          program.unshiftContainer('body', t.importDeclaration([
            t.importDefaultSpecifier(id)
          ], t.stringLiteral(module)));
        }
      }
    }
  }
}

