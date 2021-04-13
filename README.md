# Overview

### Project Overview

Our proposed project is an SDR Transcriber System. This system will allow for the remote operation, listening and tuning of a software defined radio, with the ability to transcribe and summarize the received RF information.
 
We propose a system that uses multiple SDRs (Software Defined Radio), different API’s and a database, to create an application that allows users to view information received by the radio. The application will contain information from the radio such as information about the music being played, the current news, and the ability for a user to remotely control an SDR to livestream a particular radio station through the website as well.

This application will allow users to access information from the radio. They can then use this valuable information however they wish.

We have made this application a progressive web application, meaning it works as a normal website in the browser, and also has the ability to be downloaded and used as a mobile application, so users can use the app on multiple devices.
 
Upon doing more research, we have not found a product that currently exists that has this functionality or anything similar to it. 

### High Level Design

This system will be able remotely control an SDR to listen to the radio, convert voice data received by an SDR into text for later reading, and perform music recognition to identify a particular song that is currently playing on the radio.

The design concept has 3 SDRs that are plugged in tto a personal computer, which each have the ability to be controlled remotely by an application running on the computer. The music SDR scans the FM music stations and perform song recognition to get information about the song. This information is then stored in a database and the application is updated with the new information simulataneously. The news SDR receives audio from the KYW news station, which is transcribed to text. This text is also put on the website. The news station is also being recorded by the SDR so a user is able to connect and listen to the livestream of the news station through the application as well. Lastly there is a third SDR which a user can remotely tune to a particular FM music station, to listen to the station via the application. 

### Testing documents
We have 3 acceptance testing documents, for testing and verification purposes, which are linked below

- [Mobile App Acceptance Testing (Chrome)](./SDR%20Transcriber%20Mobile%20Website%20Acceptance%20Test%20Scripts%20-%20Chrome%20-%20Sheet1.pdf)
- [Website Acceptance Testing (Chrome)](./SDR%20Transcriber%20Website%20Acceptance%20Test%20Scripts%20-%20Chrome%20-%20Sheet1.pdf)
- [Website Acceptance Testing (Safari)](./SDR%20Transcriber%20Website%20Acceptance%20Test%20Scripts%20-%20Safari%20-%20Sheet1.pdf)

Please Contact Trevor Lewis at tuh12644@temple.edu for QA Technical Support


### Requirements include:

* 3 SDRs capable of receiving RF 
* A speech to text transcription API 
* A song recognition API
* A database capable of storing transcription data
* A small cloud server
* A web browser
* A Client (laptop, phone, tablet, etc.)

# Contributors
* Daniel McShane
* Alex Liu
* Annalise McLarnon
* Aryanna Anderson
* Marc Frattarelli
* Trevor Lewis
