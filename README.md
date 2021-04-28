# Overview

### Project Overview
Our proposed project is an SDR Transcriber System. This system will allow for the remote operation, listening and tuning of a software defined radio, with the ability to transcribe and summarize the received RF information.
 
We propose a system that uses multiple SDR (Software Defined Radio) devices, different API’s and a database, to create an application that allows users to view information received by the radio. The application will contain information from the radio such as information about the music being played, the current news, and the ability for a user to remotely control an SDR to livestream a particular radio station through the application as well.

This application will allow users to access information from the radio. They can then use this valuable information however they wish.

We have made this application a progressive web application, meaning it works as a normal website in the browser, and also has the ability to be downloaded and used as a mobile application, so users can use the app on the go as well.
 
Upon doing more research, we have not found a product that currently exists that has this functionality or anything similar to it. 

### High Level Design
Our system can be broken down into separate parts. First, we will be using three separate SDR devices which will be capturing different data: a music SDR, a news SDR, and a livestream SDR. The music SDR will be used to crawl through the music stations to capture data about the music being played on the radio. The news SDR while tune into a particular news station to capture that data. Lastly, the livestream SDR will be able to tune into a particular RF channel to stream the audio content to a user directly through to the client application.
 
We will have separate applications to control each SDR device. The music SDR device will be controlled to automatically move through the music stations. It will tune into a particular station for a set amount of time, record the audio, and send it to an API to be processed. We will be using a song recognition API, where when given the audio of a particular song, it returns the name of that song as well as other useful metadata, such as the artist and a Spotify link to the song. When the metadata of a particular song is received it will be sent to a database to then update the client application with the information.  

The news SDR device will tune into one particular news radio station. It will be controlled to record a set amount of audio at a time. This audio will then be sent to an audio transcription API, where the audio will be transcribed to text. This text will then be sent to the database to then update the client application. The news SDR will also send the raw audio to an audio conversion server (Icecast) which will turn the raw audio into a livestream. This livestream will also be sent to the application. This allows users to both read and listen to the news in the client application.
The livestream SDR device will be programmed to remotely tune into a particular radio station based on user input from the client application. The SDR application will then record and send the raw audio as TCP packets to the client application, to convert into a livestream. We will be using this approach for the livestream SDR because it will provide low latency streaming which is necessary for the associated section of the client application.

Finally, we will have our client application. We will be creating a progressive web application which allows the application to work as both a website and mobile application. The application will contain all of the received information from the SDR devices. Users will have the ability to view information about the music stations, such as what songs are playing on each station. Users will have the ability to read and listen to the news reports. And lastly users will have the ability to tune into a particular radio station and listen to the station through the app. 
 
Each SDR device will constantly perform their functions as they continue to receive data, so we expect to continuously update the client application in real time as information from the SDR devices is received. This will keep the client application up to date with what is happening on the radio. 

### Requirements:
*	3 SDR devices capable of receiving RF 
*	3 separate GQRX applications (SDR Receiver Application)
*	Audd (music recognition API)
*	Spotify API (for song popularity ranking and album cover)
*	Assembly AI (audio transcription API)
*	Icecast (streaming media server)
*	RDS MySQL Database instance 
*	NodeJS Express Server
*	React Application
*	EC2 server
*	Client (computer, phone, tablet, etc.)

### Features
* Search for station by name, frequency, or music genre
* View set lists of songs for specified FM music station
* Search for artist or song in specified set list
* play song in set list using Spotify embedded link
* View top 20 most popular songs being played on Philadelphia radio
* Read the KYW news report
* Listen to the KYW news station
* Connect and listen to an FM music station of your choice
* Scan through the FM music station to find a station you like
* Download the mobile version of the application to do all of these things on the go!


### Known Bugs
* Within the 'listen to radio' section of the application only one user can listen to the radio at a time. Did not find a way to let multiple users connect to the SDR
* Within the 'listen to radio' section the scanning only seems to work on the first time. If you stop scanning and try to scan again it will not scan through stations. Were unable to come up with a solution in time.

### View Application Instructions
To view and use the application a user can go to this public address: https://sdrtranscriber.tk/. To install the mobile version on an Android device, a user can go to this address in their browser. Then on the home page there should be button to install the mobile app. To install on an iPhone device, a user can also go to this address in the browser and then add the application to their home screen as a bookmark.

### Build Application Instructions
To build and run the entire application on your own local machine you would first need to have three SDR devices that can connect to your local machine. You would also need to have the GQRX software on your local machine to control the SDR devices.

You could then download the source code, and you would need to run the code in the sdr-backend folder on the local machine with the SDR devices connected to it to control the SDR devices to gather the backend data for the application.

To run the rest of the application, on another machine you would need to first make sure you have NodeJS and npm installed. Next you would need to download the source code. You would then need to cd into the server folder and run 'npm install' to install all the necessary packages. You would also need to cd into the client folder and run 'npm install' to download the necessary packages for that application as well. After doing these two things you would be ready to build and run the application. 

To do that you can use these two script files which will build and run both applications. After completing these steps you would have the whole application running on your local machine.

(This application can only work if the remote machine with the SDR devices as well as the database is up and running!)


### Contributors
* Daniel McShane
* Alex Liu
* Annalise McLarnon
* Aryanna Anderson
* Marc Frattarelli
* Trevor Lewis
