// Encode an SVG element as a base64 data uri.
function svgToBase64Image(svgElement) {
  var div = document.createElement('div');
  div.appendChild(svgElement.cloneNode(true));
  var b64 = window.btoa(div.innerHTML);
  return 'data:image/svg+xml;base64,' + b64;
}
var svgs = document.getElementsByTagName('svg');
var urls = [];
for (var i = 0; i < svgs.length; i++)
  urls.push('url("' + svgToBase64Image(svgs[i]) + '")');
var url = urls.join(',');
document.getElementById('graph').style.background = url;

function getTimeRemaining(endtime, starttime) {
  const total = Date.parse(endtime) - Date.parse(starttime);
  const left = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((left / 1000) % 60);
  const minutes = Math.floor((left / 1000 / 60) % 60);
  const hours = Math.floor((left / (1000 * 60 * 60)) % 24);
  
  return {
    total,
    left,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime, starttime, endtimeAdjustment, breaktime, scheduledtime, optionaltime) {
    const clock = document.getElementById(id);
    
    endtime.setHours( endtime.getHours() - endtimeAdjustment );

    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');

    const graph = document.getElementById('graph');
    const timetext = document.getElementById('timetext');
    const usedDiv = graph.querySelector('.used');
    const leftDiv = graph.querySelector('.left');

    function updateClock() {
        
    const t = getTimeRemaining(endtime,starttime);

    timetext.innerHTML = ('' + t.hours + 'h ' + t.minutes + 'm usable time left');
    totalHeight = 100;
    leftHeight = Math.round(t.left / t.total * 100);
    usedHeight = 100 - leftHeight;
    //timetext.style.height = totalHeight + 'px';
    leftDiv.style.height = leftHeight + '%';
    usedDiv.style.height = usedHeight + '%';
    hoursSpan.innerHTML = ('' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.left <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

// const endtime = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000); // for 24 from page load
// Set endtime to midnight in the future:
const endtime = new Date();
endtime.setHours(24,0,0,0); //midnight
const starttime = new Date();
starttime.setHours(9,0,0,0); //9am

// All the times and quantities should be settled and passed into initialize clock
// adjust endtime here before we pass it in
// * New endtime OR endtime MINUS time quantity?
// let's pass in what needs to be subtracted
// * Add these up before passing in?
// * breaks
// * scheduled time out
// * "gray" time - time where things are going on but you could skip if you had to
let endtimeAdjustment = 3 // make it 9pm instead of midnight. Should calculate this from a time though and convert into # hours / min / sec
let breaktime = 4 // set the time for meals, breaks
let scheduledtime = 0 // No meetings or things to do
let optionaltime = 5.5 // Twitch on Sundays

initializeClock('countdown', endtime, starttime, endtimeAdjustment, breaktime, scheduledtime, optionaltime);