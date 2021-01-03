import * as path from 'path';

import { LoadContext } from '@docusaurus/types';

const mockAppBootstrap = jest.fn();
const mockAppConvert = jest.fn().mockImplementation(() => true);
const mockExpandInputFiles = jest.fn();
const mockGenerateDocs = jest.fn();
const mockWriteSidebar = jest.fn();

jest.mock('typedoc', () => {
  return {
    TypeDocReader: jest.fn().mockImplementation(() => {}),
    TSConfigReader: jest.fn().mockImplementation(() => {}),
    Application: jest.fn().mockImplementation(() => {
      return {
        bootstrap: mockAppBootstrap,
        convert: mockAppConvert,
        generateDocs: mockGenerateDocs,
        expandInputFiles: mockExpandInputFiles,
        options: { addReader: jest.fn() },
        renderer: {
          addComponent: jest.fn().mockImplementation(() => true),
          getComponent: jest.fn().mockImplementation(() => {
            return {
              isOutputDirectory: jest.fn().mockImplementation(() => true),
              getNavigation: jest.fn().mockImplementation(() => []),
            };
          }),
        },
      };
    }),
  };
});

jest.mock('../../dist/front-matter');

jest.mock('../../dist/sidebar', () => {
  return {
    writeSidebar: mockWriteSidebar,
  };
});

describe(`Plugin:`, () => {
  let plugin;
  const context = { siteDir: '/siteDir' } as LoadContext;
  const defaultOptions = {
    entryFile: 'index.md',
    plugin: ['typedoc-plugin-markdown'],
    theme: path.resolve(__dirname, '..', '..', 'dist', 'theme'),
  };
  beforeEach(() => {
    mockAppBootstrap.mockClear();
    mockGenerateDocs.mockClear();
    mockWriteSidebar.mockClear();
    jest.isolateModules(() => {
      plugin = require('../../dist/plugin').default;
    });
  });

  describe(`(typedoc options):`, () => {
    test('should bootstrap with default options', async () => {
      await plugin(context, {});
      expect(mockAppBootstrap).toHaveBeenCalledWith(defaultOptions);
    });

    test('should bootstrap with additional options', async () => {
      await plugin(context, { mode: 'file' });
      expect(mockAppBootstrap).toHaveBeenCalledWith({
        ...defaultOptions,
        mode: 'file',
      });
    });

    test('should bootstrap with additional typedoc plugin', async () => {
      await plugin(context, { plugin: ['typedoc-plugin-xyz'] });
      expect(mockAppBootstrap).toHaveBeenCalledWith({
        ...defaultOptions,
        plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-xyz'],
      });
    });

    test('should not duplicate markdown plugin', async () => {
      await plugin(context, {
        plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-xyz'],
      });
      expect(mockAppBootstrap).toHaveBeenCalledWith({
        ...defaultOptions,
        plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-xyz'],
      });
    });
  });
  describe(`(plugin options):`, () => {
    test('should set default output directory', async () => {
      await plugin(context, {});
      expect(mockGenerateDocs).toHaveBeenCalledWith(
        true,
        context.siteDir + '/docs/api',
      );
    });
    test('should set custom output directory', async () => {
      await plugin(context, { out: 'myapi' });
      expect(mockGenerateDocs).toHaveBeenCalledWith(
        true,
        context.siteDir + '/docs/myapi',
      );
    });
    test('should set in root dir', async () => {
      await plugin(context, { out: '' });
      const outputDirectory = context.siteDir + '/docs';
      expect(mockGenerateDocs).toHaveBeenLastCalledWith(true, outputDirectory);
    });
  });

  describe(`(sidebar options):`, () => {
    test('should write sidebar with default options', async () => {
      await plugin(context, {});
      expect(mockWriteSidebar).toHaveBeenLastCalledWith(
        true,
        context.siteDir,
        'api',
        {
          fullNames: false,
          sidebarFile: 'typedoc-sidebar.js',
          globalsLabel: 'Index',
          readmeLabel: 'Readme',
        },
        [],
      );
    });
    test('should write sidebar with merge sidebar options', async () => {
      await plugin(context, {
        sidebar: { sidebarFile: 'custom-sidebar.js' },
      });
      expect(mockWriteSidebar).toHaveBeenLastCalledWith(
        true,
        context.siteDir,
        'api',
        {
          fullNames: false,
          sidebarFile: 'custom-sidebar.js',
          globalsLabel: 'Index',
          readmeLabel: 'Readme',
        },
        [],
      );
    });

    test('should not write sidebar if null', async () => {
      await plugin(context, { sidebar: null });
      expect(mockWriteSidebar).toHaveBeenCalledTimes(0);
    });
  });
});
