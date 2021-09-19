function getTimeRemaining(endtime,starttime) {
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

function initializeClock(id, endtime, starttime) {
  const clock = document.getElementById(id);
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  const bar = document.getElementById('bar');
  const totalDiv = bar.querySelector('.total span');
  const usedDiv = bar.querySelector('.used');
  const leftDiv = bar.querySelector('.left');

    function updateClock() {
      // adjust endtime here before we pass it in
          // * New endtime OR endtime MINUS time quantity?
      // let's pass in what needs to be subtracted
        // * Add these up before passing in?
        // * breaks
        // * scheduled time out
        // * "gray" time - time where things are going on but you could skip if you had to

        
    const t = getTimeRemaining(endtime,starttime);

    totalDiv.innerHTML = ('' + t.hours + 'h ' + t.minutes + 'm left');
    totalHeight = 100;
    leftHeight = Math.round(t.left / t.total * 100);
    usedHeight = 100 - leftHeight;
    totalDiv.style.height = totalHeight + 'px';
    leftDiv.style.height = leftHeight + 'px';
    usedDiv.style.height = usedHeight + 'px';
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

// const deadline = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000); // for 24 from page load
// Set deadline to midnight in the future:
const deadline = new Date();
deadline.setHours(24,0,0,0);
const starttime = new Date();
starttime.setHours(8,0,0,0);
initializeClock('clockdiv', deadline, starttime);