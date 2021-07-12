import * as Handlebars from 'handlebars';
import { Reflection } from 'typedoc';

import { TestApp } from '../test-app';

describe(`Breadcrumbs:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;

  describe(`(with readme)`, () => {
    let testApp: TestApp;
    beforeAll(async () => {
      testApp = new TestApp(['breadcrumbs.ts']);
      await testApp.bootstrap();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    test(`should compile README breadcrumbs'`, () => {
      expect(
        Handlebars.helpers.breadcrumbs.call({
          project: testApp.project,
          model: testApp.project,
          url: 'README.md',
        }),
      ).toMatchSnapshot();
    });

    test(`should compile entryPoint (globals) breadcrumbs'`, () => {
      expect(
        Handlebars.helpers.breadcrumbs.call({
          project: testApp.project,
          model: testApp.project,
          url: 'globals.md',
        }),
      ).toMatchSnapshot();
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        Handlebars.helpers.breadcrumbs.call({
          project: testApp.project,
          model: moduleReflection,
          url: moduleReflection.url,
        }),
      ).toMatchSnapshot();
    });
    test(`should compile class breadcrumbs'`, () => {
      expect(
        Handlebars.helpers.breadcrumbs.call({
          project: testApp.project,
          model: classReflection,
          url: classReflection.url,
        }),
      ).toMatchSnapshot();
    });
  });
  describe(`(without readme)`, () => {
    let testApp: TestApp;
    beforeAll(async () => {
      testApp = new TestApp(['breadcrumbs.ts']);
      await testApp.bootstrap({ readme: 'none' });
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        Handlebars.helpers.breadcrumbs.call({
          project: testApp.project,
          model: moduleReflection,
          url: moduleReflection.url,
        }),
      ).toMatchSnapshot();
    });
    test(`should compile class breadcrumbs'`, () => {
      expect(
        Handlebars.helpers.breadcrumbs.call({
          project: testApp.project,
          model: classReflection,
          url: classReflection.url,
        }),
      ).toMatchSnapshot();
    });
  });
});
