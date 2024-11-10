# gs-csv-analyzer
A Google app script repo which takes in credit card transaction data and group spending according to different configurable categories. 

Note:
- this repo uses `Script Properties` to configure Cache Timeout
- Sheet `Constants` to hold constants

## Read the code
Can start reading the program via 
- `Code.gs`
- `StripHoSpending.gs`

## Soundux algorithm 
The soundux used in this repo is originated from codedrome (2019,Nov),
it then personlized for handling data in this project. 
For personlization, find in `Soundex.gs`

# Technology
- Google services 
- JS (ECMA)
- Soundux

## Google services
- Google App Script (PropertiesService, runner)
- Google Cache Service
- Google Spreadsheet
