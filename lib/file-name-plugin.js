'use strict';

/* eslint-env node */
const locationAttribute = 'l';
const blockHelpers = ['each', 'each-in', 'let', 'with', 'if', 'unless'];
const undasherizedComponents = ['input', 'component'];

module.exports = function ({ appOrAddonIndex, moduleName }) {
  return class Plugin {
    constructor(env) {
      if (env.moduleName) {
        let fileName = env.moduleName.replace(`${moduleName}/`, '');
        this.fileHash = `${appOrAddonIndex}:${fileName}`;
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
            let {
              path: { type, original },
              hash,
              params,
            } = node;

            let isComponent =
              type === 'PathExpression' &&
              (undasherizedComponents.includes(original) ||
                original.includes('-')) &&
              (params.length > 0 || hash.pairs.length > 0);

            if (!isComponent) {
              return;
            }

            if (fileHash) {
              let startLocation = node.loc.start;
              let file = `${fileHash}:${startLocation.line}:${startLocation.column}`;
              let attrNode = builders.pair(
                locationAttribute,
                builders.string(file)
              );

              hash.pairs.push(attrNode);
            }
            return node;
          },
        },

        ElementNode: {
          enter(node) {
            if (node.tag.startsWith(':')) {
              return node;
            }

            if (fileHash) {
              let startLocation = node.loc.start;
              let file = `${fileHash}:${startLocation.line}:${startLocation.column}`;
              let attrNode = builders.attr(
                locationAttribute,
                builders.text(file)
              );

              node.attributes.push(attrNode);
            }
            return node;
          },
        },

        BlockStatement: {
          enter(node) {
            let {
              path: { type, original },
              hash,
            } = node;

            let isComponent =
              type === 'PathExpression' && !blockHelpers.includes(original);

            if (!isComponent) {
              return;
            }

            if (fileHash) {
              let startLocation = node.loc.start;
              let file = `${fileHash}:${startLocation.line}:${startLocation.column}`;
              let attrNode = builders.pair(
                locationAttribute,
                builders.string(file)
              );

              hash.pairs.push(attrNode);
            }
            return node;
          },
        },
      };

      syntax.traverse(ast, visitor);
      return ast;
    }
  };
};
