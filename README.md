# NightOS

NightOS is an open-source operating system based on NodeJS technology.

## How to install

### Alpha Preview 0.1

To install the Alpha Preview 0.1 version, just download this repository or click here : https://github.com/ClementNerma/NightOS/archive/master.zip

Then, extract the zip, go to the "node-webkit" directory, and launch "nw" program.

## Bug fixes

On Ubuntu 14.04, Node-WebKit doesn't work properly the first time you launch it, because cannot found libudev.so:1; so you have to use this command to fix the problem :

```sudo ln -sf /lib/x86_64-linux-gnu/libudev.so.1 /lib/x86_64-linux-gnu/libudev.so.0```
