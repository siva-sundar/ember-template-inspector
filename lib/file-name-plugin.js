'use strict';

/* eslint-env node */
const locationAttribute = 'data-loc';

module.exports = function() {
  return class Plugin {
    constructor(env) {
      this.env = env;
    }

    transform(ast) {
      let { syntax } = this;
      let { builders } = syntax;
      let startLoc = ast.loc ? ast.loc.start : {};

      if (startLoc.line !== 1 || startLoc.column !== 0) {
        return ast;
      }

      let { moduleName } = this.env;
      let visitor = {

        MustacheStatement: {
          enter(node) {
            let { path: { original }, hash = [], params = [] } = node;

            if (original.constructor === String
              && !(original.includes('-') && (hash.pairs.length > 0 || params.length > 0))) {
              return;
            }

            let startLocation = node.loc.start;
            let file = `${moduleName}:${startLocation.line}:${startLocation.column}`;
            let attrNode = builders.pair(locationAttribute, builders.string(file));

            hash.pairs.push(attrNode);
            return node;
          }
        },

        ElementNode: {
          enter(node) {
            let startLocation = node.loc.start;
            let file = `${moduleName}:${startLocation.line}:${startLocation.column}`;
            let attrNode = builders.attr(locationAttribute, builders.text(file));

            node.attributes.push(attrNode);
            return node;
          }
        },

        BlockStatement: {
          enter(node) {
            let { path: { original }, hash } = node;

            if (original.constructor === String
              && !original.includes('-')) {
              return;
            }

            let startLocation = node.loc.start;
            let file = `${moduleName}:${startLocation.line}:${startLocation.column}`;
            let attrNode = builders.pair(locationAttribute, builders.string(file));

            hash.pairs.push(attrNode);
            return node;
          }
        }
      };

      syntax.traverse(ast, visitor);
      return ast;
    }
  };
};
