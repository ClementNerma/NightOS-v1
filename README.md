# NightOS

NightOS is an open-source operating system based on NodeJS technology.

## How to install

### Alpha Preview 0.1

To install the Alpha Preview 0.1 version, just download this repository or click here : https://github.com/ClementNerma/NightOS/archive/master.zip

Then, extract the zip, go to the "node-webkit" directory, and launch "nw" program.

## Bug fixes

On Ubuntu 14.04, Node-WebKit doesn't work properly the first time you launch it, because cannot found libudev.so:1; so you have to use this command to fix the problem :

```sudo ln -sf /lib/x86_64-linux-gnu/libudev.so.1 /lib/x86_64-linux-gnu/libudev.so.0```

# License

This project is under the license Creative Commons Attribution 4.0 International - No commercial - No derivative terms (see more at http://creativecommons.org/licenses/by-nc-nd/4.0/)

# Bugs and data lost

I'm not responsible for any damage caused to your computer by NightOS, including data lost, bugs, etc.
I've minutetly studied the projet and if your computer encounter a problem with NightOS, it's certainly because of your computer and not of NightOS.
