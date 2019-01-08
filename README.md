# MP3 metadata editor using Deezer api

## Installation
The following installation steps are those needed for an installation on ubuntu 18.04, if you have another debian distribution, it should work the same way.
### 1) Cloning the repository
First, you will need to clone the repository :
```Bash
git clone https://github.com/edvgui/MetaSong.git
```
### 2) Installing the server
Check if you have nodejs installed :
```Bash
node --version
```
This project should work for node v.8.10.0 and later.

Check if you have npm installed :
```Bash
npm -v
```
If you don't have it, install it :
```Bash
sudo apt install npm
```
Once it's done, open a terminal in your project clone directory and type :
```Bash
npm i
npm i --only=dev
```
### 3) Installing mongodb
The server uses a mongodb database, to install it please checkout this site : [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
By default the server should be launched on the port 27017 of your machine, it needs to be this way for this server's current configuration.

### 4) Launching the server
To launch the server simply type (still in the project directory):
```Bash
npm run dev
```
This previous command will launch the server in development mode, to allow you to quickly relaunch it after some file change.  To launch it without the development environment, type :
```Bash
node src/server.js
```
This should work and display on the standard output the port on which the server is listening.  This should look like :
```Bash
Server development HTTP listen on port 3000.
```
### 5) Testing
To test if your installation is working, simply enter this url in your browser : [localhost:3000](http://localhost:3000)  (You might need to change 3000 by the port on which your server is listening to.)

## Usage
To launch the server in background (using a stable version of it) it is suggested to use pm2, a simple tool to deamonize nodejs servers.
If you haven't it installed on your machine you can install it by typing (in this project directory folder) :
```Bash
sudo npm install -g pm2
```
And then add your process to it by typing :
```
pm2 start src/server.js
```
If you need to stop it (after having updated it for example) use this command :
```Bash
pm2 delete src/server.js
```
Depending on the use that you will make of this server, you might need to run it as superuser (to take measure on some specific process for example).  Unfortunately pm2 doesn't allow to run the server as root, but a script in the folder /tools does.
First you need to edit this script so that it will match your installation.  You might need to change the value of dir (line 12) which specify your installation folder.
Thanks to this script you can run the server as a service by simply typing :
```Bash
sudo chmod +x /path/to/your/script/metasong
sudo /path/to/your/script/metasong start
```
## Contributing
This project is developped without any garantee of further improvment of maintenance.  If you want to help your help is welcome, you can start by posting issues and pull requests. 

## License
This project is under MIT license, feel free to use it at your own will.
