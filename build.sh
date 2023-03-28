#!/bin/bash

# Copyright(c) 2023 Alex313031

YEL='\033[1;33m' # Yellow
CYA='\033[1;96m' # Cyan
RED='\033[1;31m' # Red
GRE='\033[1;32m' # Green
c0='\033[0m' # Reset Text
bold='\033[1m' # Bold Text
underline='\033[4m' # Underline Text

# Error handling
yell() { echo "$0: $*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "${RED}Failed $*"; }

# --help
displayHelp () {
	printf "\n" &&
	printf "${bold}${GRE}Script to build Apple Music Electron on Linux.${c0}\n" &&
	printf "${bold}${YEL}Use the --deps flag to install build dependencies.${c0}\n" &&
	printf "${bold}${YEL}Use the --bootstrap flag to \`yarn install\`.${c0}\n" &&
	printf "${bold}${YEL}Use the --build flag to build Apple Music Electron.${c0}\n" &&
	printf "${bold}${YEL}Use the --clean flag to run \`yarn run clean\`.${c0}\n" &&
	printf "${bold}${YEL}Use the --dist flag to generate installation packages.${c0}\n" &&
	printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
	printf "\n"
}
case $1 in
	--help) displayHelp; exit 0;;
esac

VER="3.0.2"

# Install prerequisites
installDeps () {
	sudo apt-get install build-essential git libsecret-1-dev libgtk-3-dev fakeroot rpm libx11-dev libxkbfile-dev nodejs npm node-gyp node-istanbul
}
case $1 in
	--deps) installDeps; exit 0;;
esac

cleanAppleMusic () {
	printf "\n" &&
	printf "${bold}${YEL} Cleaning artifacts and dist directory...${c0}\n" &&
	printf "\n" &&
	
	yarn run clean
}
case $1 in
	--clean) cleanAppleMusic; exit 0;;
esac

bootstrapAppleMusic () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export CXXFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export CPPFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export LDFLAGS="-Wl,-O3 -msse3 -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping with \`yarn install\`...${c0}\n" &&
printf "\n" &&

yarn install
}
case $1 in
	--bootstrap) bootstrapAppleMusic; exit 0;;
esac

buildAppleMusic () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export CXXFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export CPPFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export LDFLAGS="-Wl,-O3 -msse3 -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "\n" &&
printf "${bold}${GRE} Building Apple Music Electron Ver. ${VER} for Linux...${c0}\n" &&
printf "\n" &&

yarn install &&
export NODE_ENV=production &&
yarn run build &&

printf "\n" &&
printf "${bold}${GRE} Done! Build is at \`dist/linux-unpacked/\`${c0}\n" &&
printf "\n"
}
case $1 in
	--build) buildAppleMusic; exit 0;;
esac

packageAppleMusic () {
# Optimization parameters
export CFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export CXXFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export CPPFLAGS="-DNDEBUG -msse3 -O3 -g0 -s" &&
export LDFLAGS="-Wl,-O3 -msse3 -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "\n" &&
printf "${bold}${GRE} Generating installation packages for Ver. ${VER}...${c0}\n" &&
printf "\n" &&

yarn install &&
export NODE_ENV=production &&
yarn run dist &&

printf "\n" &&
printf "${bold}${GRE} Done! Packages are in \`dist/\`${c0}\n" &&
printf "\n"
}
case $1 in
	--dist) packageAppleMusic; exit 0;;
esac

printf "\n" &&
printf "${bold}${GRE}Script to build Apple Music Electron on Linux.${c0}\n" &&
printf "${bold}${YEL}Use the --deps flag to install build dependencies.${c0}\n" &&
printf "${bold}${YEL}Use the --bootstrap flag to \`yarn install\`.${c0}\n" &&
printf "${bold}${YEL}Use the --build flag to build Apple Music Electron.${c0}\n" &&
printf "${bold}${YEL}Use the --clean flag to run \`yarn run clean\`.${c0}\n" &&
printf "${bold}${YEL}Use the --dist flag to generate installation packages.${c0}\n" &&
printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
printf "\n" &&

tput sgr0 &&
exit 0
