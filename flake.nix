{
  inputs = {
    flakelight = {
      url = "github:nix-community/flakelight";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs = {flakelight, ...}:
    flakelight ./. {
      devShell.packages = pkgs:
        with pkgs; [
          alejandra
          yaml-language-server
          typescript-language-server
          bun
          tailwindcss
          tailwindcss-language-server
        ];
    };
}
