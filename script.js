/* =========================
GLOBAL VARIABLES
========================= */

let currentLat = null;
let currentLon = null;

let surveyPoints = [];

let map;
let polygon;
let markers = [];

/* =========================
ELEMENTS
========================= */

const conversionType =
document.getElementById('conversionType');

const decimalSection =
document.getElementById('decimalSection');

const dmsSection =
document.getElementById('dmsSection');

const utmSection =
document.getElementById('utmSection');

const pointInputType =
document.getElementById('pointInputType');

const pointDecimalSection =
document.getElementById('pointDecimalSection');

const pointDMSSection =
document.getElementById('pointDMSSection');

const pointUTMSection =
document.getElementById('pointUTMSection');

/* =========================
INIT MAP
========================= */

map = L.map('map').setView([28.1099,30.7503],9);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:'© OpenStreetMap'
}
).addTo(map);

/* =========================
THEME
========================= */

function toggleTheme(){

document.body.classList.toggle('light');

}

/* =========================
SWITCH CONVERTER
========================= */

conversionType.addEventListener(
'change',
switchConverter
);

function switchConverter(){

decimalSection.style.display =
'none';

dmsSection.style.display =
'none';

utmSection.style.display =
'none';

/* DECIMAL → DMS */

if(
conversionType.value ===
'decimalToDMS'
){

decimalSection.style.display =
'block';

}

/* DMS → DECIMAL */

if(
conversionType.value ===
'dmsToDecimal'
){

dmsSection.style.display =
'block';

}

/* DECIMAL → UTM */

if(
conversionType.value ===
'decimalToUTM'
){

decimalSection.style.display =
'block';

}

/* UTM → DECIMAL */

if(
conversionType.value ===
'utmToDecimal'
){

utmSection.style.display =
'block';

}

}

/* =========================
POINT INPUT
========================= */

pointInputType.addEventListener(
'change',
switchPointInput
);

function switchPointInput(){

pointDecimalSection.style.display =
'none';

pointDMSSection.style.display =
'none';

pointUTMSection.style.display =
'none';

/* DECIMAL */

if(
pointInputType.value ===
'decimal'
){

pointDecimalSection.style.display =
'block';

}

/* DMS */

if(
pointInputType.value ===
'dms'
){

pointDMSSection.style.display =
'block';

}

/* UTM */

if(
pointInputType.value ===
'utm'
){

pointUTMSection.style.display =
'block';

}

}

/* =========================
DECIMAL TO DMS
========================= */

function decimalToDMS(decimal){

const absolute =
Math.abs(decimal);

const degrees =
Math.floor(absolute);

const minutesNotTruncated =
(absolute - degrees) * 60;

const minutes =
Math.floor(minutesNotTruncated);

const seconds =
(
(minutesNotTruncated - minutes) * 60
).toFixed(2);

return{

degrees,
minutes,
seconds

};

}

/* =========================
DMS TO DECIMAL
========================= */

function dmsToDecimal(
deg,
min,
sec,
dir
){

let decimal =

parseFloat(deg || 0) +

parseFloat(min || 0) / 60 +

parseFloat(sec || 0) / 3600;

if(
dir === 'S' ||
dir === 'W'
){

decimal *= -1;

}

return decimal;

}

/* =========================
LAT/LON TO UTM
========================= */

function latLonToUTM(lat,lon){

const zone =
Math.floor((lon + 180) / 6) + 1;

const easting =
((lon + 180) * 500).toFixed(2);

const northing =
((lat + 90) * 1000).toFixed(2);

return{

zone,
easting,
northing

};

}

/* =========================
UTM TO LAT/LON
========================= */

function utmToLatLon(
easting,
northing
){

const lon =
(easting / 500) - 180;

const lat =
(northing / 1000) - 90;

return{

lat,
lon

};

}

/* =========================
LIVE CONVERT
========================= */

document
.getElementById('decimalLat')
.addEventListener(
'input',
convertCoordinates
);

document
.getElementById('decimalLon')
.addEventListener(
'input',
convertCoordinates
);

const dmsInputs = [

'inputLatDeg',
'inputLatMin',
'inputLatSec',
'inputLatDir',

'inputLonDeg',
'inputLonMin',
'inputLonSec',
'inputLonDir'

];

dmsInputs.forEach(id=>{

document
.getElementById(id)

.addEventListener(
'input',
convertCoordinates
);

});

document
.getElementById('utmEasting')
.addEventListener(
'input',
convertCoordinates
);

document
.getElementById('utmNorthing')
.addEventListener(
'input',
convertCoordinates
);

/* =========================
MAIN CONVERTER
========================= */

function convertCoordinates(){

/* DECIMAL INPUT */

if(
conversionType.value ===
'decimalToDMS' ||

conversionType.value ===
'decimalToUTM'
){

const lat =
parseFloat(
document.getElementById('decimalLat').value
);

const lon =
parseFloat(
document.getElementById('decimalLon').value
);

if(
isNaN(lat) ||
isNaN(lon)
){

return;

}

currentLat = lat;
currentLon = lon;

/* DMS */

const latDMS =
decimalToDMS(lat);

const lonDMS =
decimalToDMS(lon);

document.getElementById('latDeg')
.value =
latDMS.degrees;

document.getElementById('latMin')
.value =
latDMS.minutes;

document.getElementById('latSec')
.value =
latDMS.seconds;

document.getElementById('latDir')
.value =
lat >= 0 ? 'N' : 'S';

document.getElementById('lonDeg')
.value =
lonDMS.degrees;

document.getElementById('lonMin')
.value =
lonDMS.minutes;

document.getElementById('lonSec')
.value =
lonDMS.seconds;

document.getElementById('lonDir')
.value =
lon >= 0 ? 'E' : 'W';

/* DECIMAL */

document.getElementById('resultLat')
.innerText =
lat.toFixed(8);

document.getElementById('resultLon')
.innerText =
lon.toFixed(8);

/* UTM */

const utm =
latLonToUTM(lat,lon);

document.getElementById('resultEasting')
.innerText =
utm.easting;

document.getElementById('resultNorthing')
.innerText =
utm.northing;

}

/* DMS INPUT */

if(
conversionType.value ===
'dmsToDecimal'
){

const lat = dmsToDecimal(

document.getElementById('inputLatDeg').value,

document.getElementById('inputLatMin').value,

document.getElementById('inputLatSec').value,

document.getElementById('inputLatDir').value

);

const lon = dmsToDecimal(

document.getElementById('inputLonDeg').value,

document.getElementById('inputLonMin').value,

document.getElementById('inputLonSec').value,

document.getElementById('inputLonDir').value

);

currentLat = lat;
currentLon = lon;

document.getElementById('resultLat')
.innerText =
lat.toFixed(8);

document.getElementById('resultLon')
.innerText =
lon.toFixed(8);

/* UTM */

const utm =
latLonToUTM(lat,lon);

document.getElementById('resultEasting')
.innerText =
utm.easting;

document.getElementById('resultNorthing')
.innerText =
utm.northing;

}

/* UTM INPUT */

if(
conversionType.value ===
'utmToDecimal'
){

const easting =
parseFloat(
document.getElementById('utmEasting').value
);

const northing =
parseFloat(
document.getElementById('utmNorthing').value
);

if(
isNaN(easting) ||
isNaN(northing)
){

return;

}

const result =
utmToLatLon(
easting,
northing
);

currentLat =
result.lat;

currentLon =
result.lon;

document.getElementById('resultLat')
.innerText =
result.lat.toFixed(8);

document.getElementById('resultLon')
.innerText =
result.lon.toFixed(8);

}

}

/* =========================
COPY RESULTS
========================= */

function copyResults(){

const text = `

Latitude:
${document.getElementById('resultLat').innerText}

Longitude:
${document.getElementById('resultLon').innerText}

Easting:
${document.getElementById('resultEasting').innerText}

Northing:
${document.getElementById('resultNorthing').innerText}

`;

navigator.clipboard
.writeText(text);

alert('Copied');

}

/* =========================
CLEAR
========================= */

function clearAllFields(){

const inputs =
document.querySelectorAll('input');

inputs.forEach(input=>{

input.value='';

});

document.getElementById('resultLat')
.innerText='---';

document.getElementById('resultLon')
.innerText='---';

document.getElementById('resultEasting')
.innerText='---';

document.getElementById('resultNorthing')
.innerText='---';

}

/* =========================
OPEN MAP
========================= */

function openMap(){

if(
currentLat === null ||
currentLon === null
){

alert('No Coordinates');

return;

}

window.open(

`https://www.google.com/maps?q=${currentLat},${currentLon}`,

'_blank'

);

}

/* =========================
ADD POINT
========================= */

function addPoint(){

let lat;
let lon;

/* DECIMAL */

if(
pointInputType.value ===
'decimal'
){

lat =
parseFloat(
document.getElementById('pointLat').value
);

lon =
parseFloat(
document.getElementById('pointLon').value
);

}

/* DMS */

if(
pointInputType.value ===
'dms'
){

lat = dmsToDecimal(

document.getElementById('pointLatDeg').value,

document.getElementById('pointLatMin').value,

document.getElementById('pointLatSec').value,

document.getElementById('pointLatDir').value

);

lon = dmsToDecimal(

document.getElementById('pointLonDeg').value,

document.getElementById('pointLonMin').value,

document.getElementById('pointLonSec').value,

document.getElementById('pointLonDir').value

);

}

/* UTM */

if(
pointInputType.value ===
'utm'
){

const easting =
parseFloat(
document.getElementById('pointEasting').value
);

const northing =
parseFloat(
document.getElementById('pointNorthing').value
);

const result =
utmToLatLon(
easting,
northing
);

lat =
result.lat;

lon =
result.lon;

}

if(
isNaN(lat) ||
isNaN(lon)
){

alert('Invalid Point');

return;

}

/* SAVE */

surveyPoints.push({

lat,
lon

});

/* UPDATE */

updateSurvey();

/* CLEAR */

clearPointInputs();

}

/* =========================
CLEAR POINTS INPUTS
========================= */

function clearPointInputs(){

const ids = [

'pointLat',
'pointLon',

'pointLatDeg',
'pointLatMin',
'pointLatSec',

'pointLonDeg',
'pointLonMin',
'pointLonSec',

'pointEasting',
'pointNorthing'

];

ids.forEach(id=>{

document.getElementById(id)
.value='';

});

}

/* =========================
DELETE POINT
========================= */

function deletePoint(index){

surveyPoints.splice(index,1);

updateSurvey();

}

/* =========================
CLEAR SURVEY
========================= */

function clearSurvey(){

surveyPoints = [];

updateSurvey();

}

/* =========================
UPDATE SURVEY
========================= */

function updateSurvey(){

const pointsList =
document.getElementById('pointsList');

pointsList.innerHTML='';

/* REMOVE OLD */

markers.forEach(marker=>{

map.removeLayer(marker);

});

markers=[];

if(polygon){

map.removeLayer(polygon);

}

/* LOOP */

surveyPoints.forEach((point,index)=>{

/* MARKER */

const marker =
L.marker([point.lat,point.lon])

.addTo(map)

.bindPopup(
`Point ${index + 1}`
);

markers.push(marker);

/* DMS */

const latDMS =
decimalToDMS(point.lat);

const lonDMS =
decimalToDMS(point.lon);

/* HTML */

pointsList.innerHTML += `

<div class="point-card">

<b>
Point ${index + 1}
</b>

<br><br>

${latDMS.degrees}°
${latDMS.minutes}'
${latDMS.seconds}"
${point.lat >= 0 ? 'N' : 'S'}

<br>

${lonDMS.degrees}°
${lonDMS.minutes}'
${lonDMS.seconds}"
${point.lon >= 0 ? 'E' : 'W'}

<button
class="delete-btn"
onclick="deletePoint(${index})">

Delete

</button>

</div>

`;

});

/* POLYGON */

if(
surveyPoints.length >= 3
){

polygon =
L.polygon(

surveyPoints.map(p=>[
p.lat,
p.lon
]),

{
color:'#38bdf8',
fillColor:'#38bdf8',
fillOpacity:0.25
}

).addTo(map);

/* ZOOM */

map.fitBounds(
polygon.getBounds()
);

}

/* TOTAL */

document.getElementById('totalPoints')
.innerText =
surveyPoints.length;

/* CALCULATE */

calculateArea();

}

/* =========================
AREA
========================= */

function calculateArea(){

if(
surveyPoints.length < 3
){

document.getElementById('areaMeters')
.innerText='0';

document.getElementById('perimeter')
.innerText='0';

return;

}

const points =
surveyPoints.map(p=>{

return{

x:
p.lon * 111320,

y:
p.lat * 110540

};

});

let area=0;
let perimeter=0;

for(
let i=0;
i<points.length;
i++
){

const j=
(i+1)%points.length;

area +=
points[i].x *
points[j].y;

area -=
points[j].x *
points[i].y;

const dx =
points[j].x -
points[i].x;

const dy =
points[j].y -
points[i].y;

perimeter +=
Math.sqrt(
(dx*dx)+(dy*dy)
);

}

area =
Math.abs(area/2);

document.getElementById('areaMeters')
.innerText =
area.toFixed(2);

document.getElementById('perimeter')
.innerText =
perimeter.toFixed(2);

}

/* =========================
GPS
========================= */

function useCurrentGPS(){

if(
navigator.geolocation
){

navigator.geolocation
.getCurrentPosition(

(position)=>{

document.getElementById('gpsStatus')
.innerText =
'Connected';

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

/* SET */

document.getElementById('pointLat')
.value =
lat.toFixed(8);

document.getElementById('pointLon')
.value =
lon.toFixed(8);

/* MAP */

map.setView(
[lat,lon],
16
);

L.marker([lat,lon])

.addTo(map)

.bindPopup(
'Current Location'
)

.openPopup();

},

()=>{

alert(
'GPS Permission Denied'
);

}

);

}

}

/* =========================
START
========================= */

switchConverter();

switchPointInput();