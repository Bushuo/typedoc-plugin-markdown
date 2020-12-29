import * as Handlebars from 'handlebars';

import { TestApp } from '../test-app';

describe(`Declarations:`, () => {
  let testApp: TestApp;

  let template: Handlebars.TemplateDelegate;

  beforeAll(async () => {
    testApp = new TestApp(['declarations.ts']);
    await testApp.bootstrap();
    TestApp.stubPartials(['member.sources']);
    TestApp.stubHelpers([]);

    template = TestApp.getPartial('member.declaration');
  });

  test(`should compile a variable with default value`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('stringWithDefaultValueDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a an udefined`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('undefinedNumberDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal declaration`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('objectLiteralDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal cast as a const`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('objectLiteralAsConstDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type literal declaration`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('typeLiteralDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type literal declaration`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('typeLiteralDeclarationWithFunction'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile declaration with double underscores in name and value`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('__DOUBLE_UNDERSCORES_DECLARATION__'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile any function type`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('AnyFunctionType'),
      ),
    ).toMatchSnapshot();
  });

  test(`should not escape charcters within markdown code`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('SpecialCharacters'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile enum delcaration`, () => {
    expect(
      TestApp.compileTemplate(
        template,
        testApp.findReflection('EnumDeclarations').children[0],
      ),
    ).toMatchSnapshot();
  });
});
