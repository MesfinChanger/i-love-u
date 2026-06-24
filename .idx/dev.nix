# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which version of the Nixpkgs channel to use.
  channel = "stable-24.11";

  # Use https://search.nixos.org/packages to find more packages
  packages = [
    pkgs.nodejs_22
    pkgs.nodePackages.firebase-tools
  ];

  # Sets environment variables in the workspace
  env = {
    # Example: MY_ENV_VAR = "hello";
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/
    extensions = [
      # "javascript-debugger"
    ];

    # Enable previews and configure how they are discovered
    previews = {
      enable = true;
      previews = {
        web = {
          # Example command to run your app
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start-server = "npm run dev";
      };
    };
  };
}