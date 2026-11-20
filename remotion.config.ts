import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});

Config.setDefaultEditor('vscode');
Config.addElementLibrary({
    'url': 'https://snapcn.dev/docs/components',
    'displayName': 'snapcn'
});
