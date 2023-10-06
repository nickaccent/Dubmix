# DubMix

## Getting Started

Open the project in your favourite IDE
Open a terminal (or command console)
Type docker-compose up (this will on first run download the php image then up the container on port 80)
Access the site on <a href="http://localhost">http://localhost</a>

## Adding your own music files for eq or pre-amp

Add file to the src/assets/preamp_sounds folder then change the loaded file name by modifying the line:

```javascript
sounds.push('http://localhost/assets/preamp_sounds/peaceloveandunity.mp3');
```
to
```javascript
sounds.push('http://localhost/assets/preamp_sounds/YOURFILENAMEHERE.mp3');
```
in the /src/js/eq.js or /src/js/scripts_preamp.js file depending on your use case.

## Adding your own music files for dubmixer

You can add a subfolder in the /src/assets/ folder with the name of your song, this can contain .wav or .mp3 files
After adding the folder you will need to manually create the 3 config files in the /src/projects folder
These are filename.json, filename_names.json and filename_info.json

## filename_info.json

This is where the name and bpm of your track goes, use the following syntax:
```javascript
{ "title": "Track Title Goes Here", "bpm": "136" }
```


## filename_names.json

This is where the names of your channels need to go, you can just use empty double speachmarks for any unused channels
i.e: ""

Use the following syntax:
```javascript
["Kick", "Snare", "Perc", "Hats", "Keys", "Bubble", "Organ", "Horns", "Guitar", "Bass"]
```


## filename.json

This is where you specify each of the individual stem locations and the name (which will be the same as the filename_names.json entry at the matching position)

Use the following syntax:
```javascript
[
{ "url": "http://localhost/assets/healing/kick.mp3", "name": "Kick", "indexval": "0" },
{ "url": "http://localhost/assets/healing/snare.mp3", "name": "Snare", "indexval": "1" },
{ "url": "http://localhost/assets/healing/perc.mp3", "name": "Perc", "indexval": "2" },
{ "url": "http://localhost/assets/healing/hats.mp3", "name": "Hats", "indexval": "3" },
{ "url": "http://localhost/assets/healing/chops.mp3", "name": "Keys", "indexval": "4" },
{ "url": "http://localhost/assets/healing/bubble.mp3", "name": "Bubble", "indexval": "5" },
{
"url": "http://localhost/assets/healing/organ.mp3",
"name": "Organ",
"indexval": "6"
},
{ "url": "http://localhost/assets/healing/horns.mp3", "name": "Horns", "indexval": "7" },
{ "url": "http://localhost/assets/healing/guitar.mp3", "name": "Guitar", "indexval": "8" },
{ "url": "http://localhost/assets/healing/bass.mp3", "name": "Bass", "indexval": "9" }
]
```


Feel free to tidy up the code, it hasn't been touched or updated in years and to be honest these days it propably doesn't even need the php parts anymore, you could for instance have a file uploader above each channel to load stems in on the fly.

I havent tested the midi functionality since it was written, though it did work when i wrote it, i assume nothing has changed but it may need updating.

Hope you enjoy messing around with this as much as i did writing it back in 2017!

---

Thanks

Nick
