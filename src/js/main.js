document.addEventListener('DOMContentLoaded', () => {

  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
      setTimeout(() => {
          loadingScreen.style.opacity = '0';
          loadingScreen.style.transition = 'opacity 0.5s ease-out';
          setTimeout(() => {
              window.location.href = 'home-english.html';
          }, 500);
      }, 2000);
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navClose = document.querySelector('.nav-close');

function updateNavBackground() {
  const header = document.querySelector('header');
  if (mainNav) {
    if (header.classList.contains('transparent')) {
      mainNav.style.background = 'rgba(255, 255, 255, 0.95)';
      mainNav.style.backdropFilter = 'blur(10px)';
      mainNav.style.webkitBackdropFilter = 'blur(10px)';
      mainNav.classList.add('nav-transparent');
    } else {
      mainNav.style.background = 'linear-gradient(135deg, #1a1f3c 0%, #2c4a7c 50%, #1a1f3c 100%)';
      mainNav.style.backdropFilter = 'none';
      mainNav.style.webkitBackdropFilter = 'none';
      mainNav.classList.remove('nav-transparent');
    }
  }
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      updateNavBackground();
  });
}


if (navClose) {
  navClose.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
  });
}


const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('.dropdown-toggle');

  if (toggle) {
      toggle.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.classList.toggle('active');
      });
  }
});


document.addEventListener('click', (e) => {
  if (!e.target.closest('.main-nav') && !e.target.closest('.menu-toggle')) {
      const mainNav = document.querySelector('.main-nav');
      const menuToggle = document.querySelector('.menu-toggle');
      if (mainNav) mainNav.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
  }
});


function handleTimelineAnimation() {
const timeline = document.querySelector('.timeline');
if (!timeline) return;

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineHeight = timeline.offsetHeight;
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

function updateTimeline() {
  const scrollPosition = window.scrollY;
  const timelineTop = timeline.offsetTop;
  const timelineBottom = timelineTop + timelineHeight;
  const windowHeight = window.innerHeight;
  const scrollPercentage = Math.min(
    Math.max(
      ((scrollPosition + windowHeight - timelineTop) /
        (timelineHeight + windowHeight)) *
        100,
      0
    ),
    100
  );

  timeline.style.setProperty('--scroll-percent', `${scrollPercentage}%`);

  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  const scrollingDown = currentScrollTop > lastScrollTop;
  lastScrollTop = currentScrollTop;

  timelineItems.forEach((item) => {
    const itemTop = item.offsetTop + timelineTop;
    const triggerPoint = scrollPosition + windowHeight * 0.8;

    if (scrollingDown && triggerPoint > itemTop) {
      item.classList.add('visible');
    } else if (!scrollingDown && triggerPoint < itemTop + item.offsetHeight) {
      item.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', updateTimeline);
window.addEventListener('resize', updateTimeline);
updateTimeline(); 
}

document.addEventListener('DOMContentLoaded', () => {
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-links a');
const aboutUsDropdown = document.querySelector('.dropdown');
const dropdownLinks = document.querySelectorAll('.dropdown-menu a');


if (currentPath.includes('origin-')) {
  handleTimelineAnimation();
}


function getPageBaseName(path) {
  const fileName = path.split('/').pop(); 
  return fileName.split('-')[0]; 
}


const currentBaseName = getPageBaseName(currentPath);

const isAboutUsPage = ['origin', 'faith'].includes(currentBaseName);


if (isAboutUsPage && aboutUsDropdown) {
  aboutUsDropdown.classList.add('active');
}


navLinks.forEach((link) => {

  if (link.classList.contains('dropdown-toggle')) return;

  const linkPath = link.getAttribute('href');
  const linkBaseName = getPageBaseName(linkPath);


  link.classList.remove('active');


  if (currentBaseName === linkBaseName) {
    link.classList.add('active');
  }


  if (currentPath === '/' || currentPath === '/index.html') {
    if (linkBaseName === 'home') {
      link.classList.add('active');
    }
  }
});


dropdownLinks.forEach((link) => {
  const linkPath = link.getAttribute('href');
  const linkBaseName = getPageBaseName(linkPath);

  
  link.classList.remove('active');

  
  if (currentBaseName === linkBaseName) {
    link.classList.add('active');
    
    if (aboutUsDropdown) {
      aboutUsDropdown.classList.add('active');
    }
  }
});
});


function getNextSunday() {
const today = new Date();
const daysUntilSunday = 7 - today.getDay();
const nextSunday = new Date(today);
nextSunday.setDate(today.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday));
return nextSunday;
}


function getNextSecondSaturday() {
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Start with the first day of current month
let date = new Date(currentYear, currentMonth, 1);

// Find the first Saturday
while (date.getDay() !== 6) {
  date.setDate(date.getDate() + 1);
}

// Add 7 days to get to the second Saturday
date.setDate(date.getDate() + 7);

// If this date has passed, move to next month
if (date < today) {
  date = new Date(currentYear, currentMonth + 1, 1);
  while (date.getDay() !== 6) {
    date.setDate(date.getDate() + 1);
  }
  date.setDate(date.getDate() + 7);
}

return date;
}

// Calendar functions
function addToGoogleCalendar(title, description, location, start, end) {
  // If it's the Sunday Service, calculate the next Sunday
  if (title === 'Sunday Service') {
    const nextSunday = getNextSunday();
    const startTime = new Date(nextSunday);
    startTime.setHours(9, 30, 0); // 9:30 AM
    const endTime = new Date(nextSunday);
    endTime.setHours(13, 0, 0); // 1:00 PM

    start = startTime.toISOString();
    end = endTime.toISOString();
  }
  // All Night service logic
  else if (title === 'All Night Service') {
    const nextService = getNextSecondSaturday();
    const startTime = new Date(nextService);
    startTime.setHours(9, 30, 0); // 9:30 AM
    const endTime = new Date(nextService);
    endTime.setHours(14, 30, 0); // 2:30 PM

    start = startTime.toISOString();
    end = endTime.toISOString();
  }
  
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const eventDetails = {
    text: title,
    details: description,
    location: location,
    dates: `${start}/${end}`.replace(/[-:]/g, ''),
  };

  const url = `${baseUrl}&text=${encodeURIComponent(
    eventDetails.text
  )}&details=${encodeURIComponent(
    eventDetails.details
  )}&location=${encodeURIComponent(eventDetails.location)}&dates=${
    eventDetails.dates
  }`;

  window.open(url, '_blank');
}

function downloadICSFile(title, description, location, start, end) {
  // If it's the Sunday Service, calculate the next Sunday
  if (title === 'Sunday Service') {
    const nextSunday = getNextSunday();
    const startTime = new Date(nextSunday);
    startTime.setHours(9, 30, 0); // 9:30 AM
    const endTime = new Date(nextSunday);
    endTime.setHours(13, 0, 0); // 1:00 PM

    start = startTime.toISOString();
    end = endTime.toISOString();
  }
  // All Night service logic
  else if (title === 'All Night Service') {
    const nextService = getNextSecondSaturday();
    const startTime = new Date(nextService);
    startTime.setHours(9, 30, 0); // 9:30 AM
    const endTime = new Date(nextService);
    endTime.setHours(14, 30, 0); // 2:30 PM

    start = startTime.toISOString();
    end = endTime.toISOString();
  }
  
  const event = {
    start: new Date(start),
    end: new Date(end),
    title: title,
    description: description,
    location: location,
    url: 'https://holyarmyfellowship.org',
  };

  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateICSFile(event) {
const formatDate = (date) => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
URL:${event.url}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

// Update scroll event listener for smoother transitions
document.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const siteTitle = document.querySelector('.site-title');
  const mainNav = document.querySelector('.main-nav');
  const scrollPosition = window.scrollY;
  const triggerHeight = 100;

  // Calculate opacity based on scroll position with easing
  const progress = Math.min(scrollPosition / triggerHeight, 1);
  const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

  requestAnimationFrame(() => {
    if (scrollPosition > 0) {
      if (scrollPosition > triggerHeight) {
        if (!header.classList.contains('transparent')) {
          header.classList.add('transparent');
          siteTitle.classList.add('transparent');
          if (mainNav && mainNav.classList.contains('active')) {
            updateNavBackground();
          }
        }
      } else {
        if (header.classList.contains('transparent')) {
          header.classList.remove('transparent');
          siteTitle.classList.remove('transparent');
          if (mainNav && mainNav.classList.contains('active')) {
            updateNavBackground();
          }
        }
      }
    } else {
      header.classList.remove('transparent');
      siteTitle.classList.remove('transparent');
      if (mainNav && mainNav.classList.contains('active')) {
        updateNavBackground();
      }
    }
  });
});