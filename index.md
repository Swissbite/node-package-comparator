---
title: Node Package Comparator
---
# Node Package Comparator

## About

On [npmjs.com](https://www.npmjs.com/) you are able to find packages. 
But I found no way to compare several packages with the same keyword by users (npm stars), 
github stars and github fork's.

So I wrote this small app based on nodejs, angularjs and mongoose/mongodb to 
compare different packages with the same keyword.

Contribution is welcome.

# Live version
The service can be found under [www.npcjs.io](http://www.npcjs.io).

## What can a user do
Just search by keyword exact one keyword and sort. If the data is older than 24h, it will be updated. Maybe a second search might be necessary.

#Plans

## Admin interface
- Force some updates.
- Configure github credentials if there is a need to (see github API limits).
- Create other admin accounts.
- Overview of current rate limits.
- Overview of pending jobs

## User login via github
- Used for having more api calls (use token of user)
- Save filter and preferences
  - disabled/enabled columns
  - sorting order (default or per search)

# Installation
Look at [install](install.html).

# License
Node Package Comparator is licensed under [GNU Affero GPL 3.0](http://www.gnu.org/licenses/agpl).