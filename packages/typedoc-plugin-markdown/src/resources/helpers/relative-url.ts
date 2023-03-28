import * as Handlebars from 'handlebars';

import { MarkdownTheme } from '../../theme';

const storybookUrlReplacements = [
  [/\.stories\.mdx/, '--page'],
  [/\.md/, '--page'],
] as [RegExp, string][];

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('relativeURL', function (url: string) {
    // just assume that we have a public path
    theme.application.logger.log(url, 1);

    let transformedUrl = url;
    for (const [regex, replacement] of storybookUrlReplacements) {
      if (regex.test(transformedUrl)) {
        transformedUrl = transformedUrl.replace(regex, replacement);
      }
    }
    transformedUrl = transformedUrl.replace(/[_\/\.]/g, '-');

    return theme.publicPath + transformedUrl;
  });
}
