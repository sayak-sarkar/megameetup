# Megameetup Manager

This app is a tool for managing meetups that span many groups. As the event world went virtual, it became important to move the physical attendees across all our meeetup cities to a single virtual event. In order to do this, we currently have to manually add/update each meetup listing in each Meetup group across various cities. With this tool, the design is 1:n for meetup to Meetup groups - you can add a meetup and choose to post it to as few or as many of the groups you're admin of.

Forked from [this original Glitch project](https://glitch.com/edit/#!/yellow-rift-promise), which predates the new OAuth login required by Meetup.

## The App

A simple *Node* app built on *Express* and utilizing the *meetup-api*. 

## Requirements

v1.0 - Bulk Meetup Creation
* I can login to this app using the Meetup OAuth flow
* I can enter details into a form for creating a new meetup
* I can see a list of the Meetup groups I'm admin of
* I can select the Meetup groups I'd like to add the new meetup to
* I can submit the form, and the new meetup will be posted to all the selected groups

v2.0 - Bulk Meetup Updates
* I can see a list of meetups scheduled across my groups, grouped by meetup title
* I can select a meetup, and see a form to edit its details, including all groups it's currently scheduled in
* I can edit the meetup details, including changing/adding/removing which groups it is in
* I can submit the form, and the existing meetups will be updated/added/removed

## Wireframe

handwaveyness

<img width="852" alt="Screen Shot 2021-04-12 at 10 37 22 PM" src="https://user-images.githubusercontent.com/50103/114488643-badd2700-9bdf-11eb-99d6-cec2535d92ab.png">
