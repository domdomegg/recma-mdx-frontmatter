import type { Plugin } from 'unified';
import type { Program } from 'estree';
import { valueToEstree } from 'estree-util-value-to-estree-cjs';
import matter from 'gray-matter';

type FrontmatterParser = (mdx: string) => unknown;

const matterBasedParser: FrontmatterParser = (mdx) => matter(mdx).data;

const recmaMdxFrontmatter: Plugin<[FrontmatterParser?], Program> = (frontmatterParser = matterBasedParser) => (ast, vfile) => {
  const data = frontmatterParser(vfile.value.toString());

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
      right: valueToEstree(data),
    },
  });
};

export = recmaMdxFrontmatter;
