'use strict';

/* eslint-env node */
const locationAttribute = 'l';

module.exports = function({ appOrAddonIndex, fileIndex, files }) {
  return class Plugin {
    constructor(env) {
      if (env.moduleName) {
        files[fileIndex] = env.moduleName
        this.fileHash = `${appOrAddonIndex}:${fileIndex}`;
        fileIndex++;
      }

    }

    transform(ast) {
      let { syntax, fileHash } = this;
      let { builders } = syntax;
      let startLoc = ast.loc ? ast.loc.start : {};

      if (startLoc.line !== 1 || startLoc.column !== 0) {
        return ast;
      }

      let visitor = {

        MustacheStatement: {
          enter(node) {
            let { path: { type, original, parts }, hash } = node;

            let isComponent = type === 'PathExpression' &&
            (original === 'input' || original.includes('-') || parts.length > 1);

            if (!isComponent) {
              return;
            }

            if (fileHash) {
              let startLocation = node.loc.start;
              let file = `${fileHash}:${startLocation.line}:${startLocation.column}`;
              let attrNode = builders.pair(locationAttribute, builders.string(file));

              hash.pairs.push(attrNode);
            }
            return node;
          }
        },

        ElementNode: {
          enter(node) {
            if (fileHash) {
              let startLocation = node.loc.start;
              let file = `${fileHash}:${startLocation.line}:${startLocation.column}`;
              let attrNode = builders.attr(locationAttribute, builders.text(file));

              node.attributes.push(attrNode);
            }
            return node;
          }
        },

        BlockStatement: {
          enter(node) {
            let { path: { type, original, parts }, hash } = node;

            let isComponent = type === 'PathExpression' &&
            (original === 'input' || original.includes('-') || parts.length > 1);

            if (!isComponent) {
              return;
            }

            if (fileHash) {
              let startLocation = node.loc.start;
              let file = `${fileHash}:${startLocation.line}:${startLocation.column}`;
              let attrNode = builders.pair(locationAttribute, builders.string(file));

              hash.pairs.push(attrNode);
            }
            return node;
          }
        }
      };

      syntax.traverse(ast, visitor);
      return ast;
    }
  };
};
