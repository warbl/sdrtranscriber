# Overview

### Project Overview

Our proposed project is an SDR Transcriber System. This system will allow for the remote operation, listening and tuning of a software defined radio, with the ability to transcribe and summarize the received RF information.
 
We propose a system that uses SDR (Software Defined Radio), along with multiple API’s and a potential database, to create a web application that allows users to view information received by the radio. The web application will contain information from the radio such as information about the music being played, the current weather, and events happening in the area. 

The web application will also include the ability for a user to remotely control an SDR to livestream a particular radio station through the website as well.

This web application will allow users to access information from the radio through a web browser. They can then use this valuable information however they wish.
 
Upon doing more research, we have not found a product that currently exists that has this functionality or anything similar to it. 

### High Level Design

This system will be able remotely control an SDR to listen to the radio, convert voice data received by an SDR into text for later reading, and perform music recognition to identify a particular song that is currently playing on the radio.

An initial design concept would look something like this: An SDR that is plugged in a personal computer, which has the ability to be controlled remotely by an application running on the computer. Depending on what station the SDR is on, the computer application will either send the received sound file to an audio transcription API to be transcribed to text, or to a song recognition API where the name of the song will be received. A cloud server will be in charge of storing the information. The cloud server will populate our website with updated information such as live music updates, news updates, and weather updates.

There will also be a separate application to control one SDR remotely to tune in to a particular radio station depending on user input. It will then broadcast the received audio from the radio back to the website.


### Requirements include:

* SDRs capable of receiving RF 
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
