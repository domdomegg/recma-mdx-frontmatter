import type { Plugin } from 'unified';
import type { Expression, Program } from 'estree';
import matter from 'gray-matter';

type MatterOption = matter.GrayMatterOption<string, MatterOption>;

const recmaMdxFrontmatter: Plugin<[MatterOption?], Program> = (matterOptions = {}) => (ast, vfile) => {
  const { data } = matter(vfile.value.toString(), matterOptions);

  ast.body.push({
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'MDXContent',
        },
        property: {
          type: 'Identifier',
          name: 'frontmatter',
        },
        computed: false,
        optional: false,
      },
      right: pojoToEstree(data),
    },
  });
};

type JSONValue = { [key: string]: JSONValue } | JSONValue[] | string | number | boolean | null;

const pojoToEstree = (value: JSONValue): Expression => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
    return { type: 'Literal', value };
  }
  if (Array.isArray(value)) {
    return { type: 'ArrayExpression', elements: value.map((element) => pojoToEstree(element)) };
  }
  if (typeof value === 'object') {
    return {
      type: 'ObjectExpression',
      properties: Object.entries(value).map(([pKey, pValue]) => ({
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        kind: 'init',
        key: pojoToEstree(pKey),
        value: pojoToEstree(pValue),
      })),
    };
  }
  const neverValue: never = value;
  throw new Error(`Unexpected pojo object: ${neverValue}`);
};

export = recmaMdxFrontmatter;
