"use strict";
const apiKey = "dkNkuyuW3x60Raf6qyXDrG8j1txCrk1jlDceezT0",
  navLinks = document.querySelectorAll(".nav-link"),
  apodDateInput = document.querySelector("#apod-date-input"),
  apodDateLabel = document.querySelector("#apod-date-input + span"),
  sideBar = document.querySelector("#sidebar"),
  overlay = document.createElement("div"),
  apodImage = document.querySelector("#apod-image-container");

// Navigate Between Sections
function navLinksF() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const sections = document.querySelectorAll(".app-section"),
        sectionId = e.currentTarget.dataset.section,
        activeSection = document.querySelector(`section#${sectionId}`);

      navLinks.forEach((link) => {
        link.classList.remove("bg-blue-500/10", "text-blue-400");
        link.classList.add("text-slate-300", "hover:bg-slate-800");
      });
      e.currentTarget.classList.add("bg-blue-500/10", "text-blue-400");
      e.currentTarget.classList.remove("text-slate-300", "hover:bg-slate-800");
      sections.forEach((section) => {
        section.classList.add("hidden");
      });
      activeSection.classList.remove("hidden");
      sideBar.classList.remove("sidebar-open");
      document.body.removeChild(overlay);
    });
  });
}
// Mobile Nav
function mobileNavF() {
  const sideBarToggle = document.querySelector("#sidebar-toggle");
  sideBarToggle.addEventListener("click", () => {
    overlay.classList = "sidebar-overlay";
    document.body.appendChild(overlay);
    sideBar.classList.add("sidebar-open");
  });
  overlay.addEventListener("click", (e) => {
    sideBar.classList.remove("sidebar-open");
    document.body.removeChild(e.currentTarget);
  });
}
// Date Inputs
function dateInputsF() {
  // Load Button
  const loadApodBtn = document.querySelector("#load-date-btn");
  loadApodBtn.addEventListener("click", () => {
    apodImage.innerHTML = `
      <div id="apod-loading" class="text-center">
        <i
          class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"
        ></i>
        <p class="text-slate-400">Loading today's image...</p>
      </div>
    `;
    const apodDate = apodDateInput.value;
    getApod(apodDate).then(displayApod);
  });
  // Today Button
  const todayApodBtn = document.querySelector("#today-apod-btn");
  todayApodBtn.addEventListener("click", () => {
    apodImage.innerHTML = `
      <div id="apod-loading" class="text-center">
        <i
          class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"
        ></i>
        <p class="text-slate-400">Loading today's image...</p>
      </div>
    `;
    apodDateLabel.innerHTML = d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    getApod().then(displayApod);
  });
  // Date Input + label
  const d = new Date(),
    date = d.toLocaleDateString("en-GB").split("/").reverse().join("-");
  apodDateInput.value = date;
  apodDateLabel.innerHTML = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  apodDateInput.addEventListener("change", (e) => {
    const d = new Date(e.currentTarget.value);
    apodDateLabel.innerHTML = d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  });
}

// APIs
// APOD API
let apodList = [];
async function getApod(date = null) {
  const base = `https://api.nasa.gov/planetary/apod`;
  let endpoint = `?api_key=${apiKey}`;
  if (date !== null) {
    endpoint += `&date=${date}`;
  }
  let res = await fetch(base + endpoint),
    data = await res.json();
  apodList = data;
}
// Launches API
let launchesList = [];
async function getLaunches(limit = 10) {
  const base = `https://lldev.thespacedevs.com/2.3.0/launches/upcoming/`,
    endpoint = `?limit=${limit}`,
    res = await fetch(base + endpoint),
    data = await res.json();
  launchesList = data.results;
}
// Planets API
let planetList = [];
async function getPlanets() {
  const base = `https://solar-system-opendata-proxy.vercel.app/api/planets`;
  let res = await fetch(base),
    data = await res.json();
  planetList = data.bodies;
}

// Display APOD
function displayApod() {
  const apodTitle = document.querySelector("#apod-title"),
    apodExp = document.querySelector("#apod-explanation"),
    apodCopy = document.querySelector("#apod-copyright"),
    apodMediaType = document.querySelector("#apod-media-type"),
    apodDate = document.querySelector("#apod-date"),
    apodDateDetail = document.querySelector("#apod-date-detail"),
    apodDateInfo = document.querySelector("#apod-date-info");
  if (apodList.code !== 404) {
    // Date
    const d = new Date(apodList.date),
      shownDate = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      dateInner = `Astronomy Picture of the Day - ${shownDate}`;
    apodDate.innerHTML = dateInner;
    apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${shownDate}`;
    apodDateInput.value = apodDateInfo.innerHTML = apodList.date;
    // Image || Video
    let imageInner;
    switch (apodList.media_type) {
      case "image":
        imageInner = `
        <img
          id="apod-image"
          class="w-full h-full object-cover"
          src="${apodList.url}"
          alt="Astronomy Picture of the Day"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div class="absolute bottom-6 left-6 right-6">
            <a
              href="${apodList.hdurl}"
              target="_blank"
              class="block w-full py-3 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-colors text-center"
            >
              <i class="fas fa-expand mr-2"></i>View Full Resolution
            </a>
          </div>
        </div>
      `;
        break;
      case "video":
        imageInner = `
        <iframe class="w-full h-full" src="${apodList.url}"></iframe>
      `;
        break;
    }
    apodImage.innerHTML = imageInner;
    // Title
    apodTitle.innerHTML = apodList.title;
    // Description
    apodExp.innerHTML = apodList.explanation;
    // Copy
    apodCopy.innerHTML = `&copy; Copyright: ${apodList.copyright}`;
    // Info
    apodMediaType.innerHTML = apodList.media_type;
  } else {
    apodImage.innerHTML = `
      <i class="text-4xl text-red-400 mb-4" data-fa-i2svg="">
        <svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
          <path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path>
        </svg>
      </i>
      <p class="text-slate-400"> Failed to load image</p>
    `;
    apodTitle.innerHTML = "";
    apodExp.innerHTML = "";
    apodCopy.innerHTML = "";
    apodMediaType.innerHTML = "";
    apodDate.innerHTML = "Astronomy Picture of the Day - Invalid date";
    apodDateDetail.innerHTML =
      '<i class="far fa-calendar mr-2"></i> Invalid date';
    apodDateInfo.innerHTML = "Invalid date";
  }
}
// Display Launches
function displayLaunches() {
  /*
    title: name
    provider: launchesList[i].launch_service_provider.name
    rocket: launchesList[i].rocket.configuration.name
    location: launchesList[i].pad.location.name
    country: launchesList[i].pad.country.name
    description: launchesList[i].mission.description
    image: launchesList[i].image.thumbnail_url
    image alt: launchesList[i].image.name
  */
  // Featured Launch
  const featured = document.querySelector("#featured-launch"),
    d = new Date(launchesList[0].net),
    launchDate = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    }),
    launchTime = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  let card;
  card = `
      <div
        class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
      >
        <div
          class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
        ></div>
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
          <div class="flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  <i class="fas fa-star"></i>
                  Featured Launch
                </span>
                <span
                  class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                >
                  Go
                </span>
              </div>
              <h3 class="text-3xl font-bold mb-3 leading-tight">
                ${launchesList[0].name}
              </h3>
              <div
                class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
              >
                <div class="flex items-center gap-2">
                  <i class="fas fa-building"></i>
                  <span>${launchesList[0].launch_service_provider.name}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-rocket"></i>
                  <span>${launchesList[0].rocket.configuration.name}</span>
                </div>
              </div>
              ${checkDaysTillLaunch()}
              <div class="grid xl:grid-cols-2 gap-4 mb-6">
                <div class="bg-slate-900/50 rounded-xl p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                  >
                    <i class="fas fa-calendar"></i>
                    Launch Date
                  </p>
                  <p class="font-semibold">${launchDate}</p>
                </div>
                <div class="bg-slate-900/50 rounded-xl p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                  >
                    <i class="fas fa-clock"></i>
                    Launch Time
                  </p>
                  <p class="font-semibold">${launchTime}</p>
                </div>
                <div class="bg-slate-900/50 rounded-xl p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                  >
                    <i class="fas fa-map-marker-alt"></i>
                    Location
                  </p>
                  <p class="font-semibold text-sm">${
                    launchesList[0].pad.location.name
                  }</p>
                </div>
                <div class="bg-slate-900/50 rounded-xl p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                  >
                    <i class="fas fa-globe"></i>
                    Country
                  </p>
                  <p class="font-semibold">${
                    launchesList[0].pad.country.name
                  }</p>
                </div>
              </div>
              <p class="text-slate-300 leading-relaxed mb-6">
                ${launchesList[0].mission.description}
              </p>
            </div>
            <div class="flex flex-col md:flex-row gap-3">
              <button
                class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <i class="fas fa-info-circle"></i>
                View Full Details
              </button>
              <div class="icons self-end md:self-center">
                <button
                  class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  <i class="far fa-heart"></i>
                </button>
                <button
                  class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  <i class="fas fa-bell"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="relative">
            <div
              class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
            >
              <div
                class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
              ></div>
              <img
                src="${launchesList[0].image.thumbnail_url}"
                alt="${launchesList[0].image.name}"
                onerror="this.src='images/launch-placeholder.png'" />
            </div>
          </div>
        </div>
      </div>
    `;
  featured.innerHTML = card;
  // Other Launches
  const launchesGrid = document.querySelector("#launches-grid");
  let cards = "";
  for (let i = 1; i < launchesList.length; i++) {
    const d = new Date(launchesList[0].net),
      launchDate = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      launchTime = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
      });
    cards += `
      <div
        class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
      >
        <div
          class="relative h-48 bg-slate-900/50 flex items-center justify-center"
        >
          <img
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src="${launchesList[i].image.thumbnail_url}"
            alt="${launchesList[i].image.name}"
            onerror="this.src='images/launch-placeholder.png'"
          />
          <div class="absolute top-3 right-3">
            <span
              class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
            >
              Go
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4
              class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
            >
              ${launchesList[i].name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launchesList[i].launch_service_provider.name}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${launchDate}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${launchTime}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">${launchesList[i].rocket.configuration.name}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${launchesList[i].pad.location.name}</span>
            </div>
          </div>
          <div
            class="flex items-center gap-2 pt-4 border-t border-slate-700"
          >
            <button
              class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
            >
              Details
            </button>
            <button
              class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  launchesGrid.innerHTML = cards;
  function checkDaysTillLaunch() {
    const currentDate = new Date();
    if (d > currentDate) {
      //                                  Diff in MS        MS     S    M   H
      const daysTillLaunch = Math.ceil((d - currentDate) / 1000 / 60 / 60 / 24);
      return `
        <div
          class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
        >
          <i class="fas fa-clock text-2xl text-blue-400"></i>
          <div>
            <p class="text-2xl font-bold text-blue-400">${daysTillLaunch}</p>
            <p class="text-xs text-slate-400">Days Until Launch</p>
          </div>
        </div>
      `;
    } else {
      return "";
    }
  }
}
// Display Planets
function displayPlanets() {
  /*
    name: englishName
    desc: description
    dist: semimajorAxis
    rad: meanRadius
    mass: massValue * 10 ^ massExponent
    density: density
    orpitalPeriod: sideralOrbit
    rotation: sideralRotation
    moons: moons.length || 0
    gravity: gravity
    discoverer: discoveredBy
    discovery date: discoveryDate
    bodyType: bodyType
    volume: volValue * 10 ^ volExponent
    axial tilt: axialTilt
    perihelion: perihelion
    aphelion: aphelion
    eccentricity: eccentricity
    inclination: inclination
    temp: avgTemp
    _escape: escape
  */
  showPlanetInfo(planetList[6]);
  const planetCards = document.querySelectorAll(".planet-card");
  planetCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      for (const planet of planetList) {
        if (
          e.currentTarget.dataset.planetId === planet.englishName.toLowerCase()
        ) {
          showPlanetInfo(planet);
        }
      }
    });
  });
  function showPlanetInfo(planet) {
    // Info
    const image = document.querySelector("#planet-detail-image"),
      name = document.querySelector("#planet-detail-name"),
      desc = document.querySelector("#planet-detail-description"),
      dist = document.querySelector("#planet-distance"),
      rad = document.querySelector("#planet-radius"),
      mass = document.querySelector("#planet-mass"),
      density = document.querySelector("#planet-density"),
      orbitalPeriod = document.querySelector("#planet-orbital-period"),
      rotation = document.querySelector("#planet-rotation"),
      moons = document.querySelector("#planet-moons"),
      gravity = document.querySelector("#planet-gravity"),
      // Discovery Info
      discoverer = document.querySelector("#planet-discoverer"),
      discoveryDate = document.querySelector("#planet-discovery-date"),
      bodyType = document.querySelector("#planet-body-type"),
      volume = document.querySelector("#planet-volume"),
      // Quick Facts
      facts = document.querySelector("#planet-facts"),
      // Characteristics
      perihelion = document.querySelector("#planet-perihelion"),
      aphelion = document.querySelector("#planet-aphelion"),
      eccentricity = document.querySelector("#planet-eccentricity"),
      inclination = document.querySelector("#planet-inclination"),
      axialTilt = document.querySelector("#planet-axial-tilt"),
      temp = document.querySelector("#planet-temp"),
      _escape = document.querySelector("#planet-escape"),
      // Comparison
      comparison = document.querySelector("#planet-comparison-tbody");

    // Info
    name.innerHTML = planet.englishName;
    desc.innerHTML = planet.description;
    dist.innerHTML = `${(planet.semimajorAxis / 1000000).toFixed(1)}M km`;
    rad.innerHTML = `${Math.round(planet.meanRadius)} km`;
    mass.innerHTML = `${planet.mass.massValue} × 10<sup>${planet.mass.massExponent}</sup> kg`;
    density.innerHTML = `${planet.density.toFixed(2)} g/cm<sup>3</sup>`;
    orbitalPeriod.innerHTML = `${planet.sideralOrbit.toFixed(2)} days`;
    rotation.innerHTML = `${planet.sideralRotation.toFixed(2)} hours`;
    moons.innerHTML = !planet.moons ? 0 : planet.moons.length;
    gravity.innerHTML = `${planet.gravity.toFixed(2)} m/s<sup>2</sup>`;
    image.src = `images/${planet.englishName.toLowerCase()}.png`;
    // Discovery Info
    discoverer.innerHTML = `${planet.discoveredBy || "Known since antiquity"}`;
    discoveryDate.innerHTML = `${planet.discoveryDate || "Ancient times"}`;
    bodyType.innerHTML = `${planet.bodyType}`;
    volume.innerHTML = `${planet.vol.volValue} × 10<sup>${planet.vol.volExponent}</sup> m<sup>3</sup>`;
    // Quick Facts
    facts.innerHTML = `
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
              <span class="text-slate-300">
                Mass: ${planet.mass.massValue} × 10<sup>${
      planet.mass.massExponent
    }</sup> kg
              </span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
              <span class="text-slate-300">
                Surface gravity: ${planet.gravity.toFixed(2)} m/s<sup>2</sup>
              </span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
              <span class="text-slate-300"
                >Density: ${planet.density.toFixed(2)} g/cm<sup>3</sup></span
              >
            </li>
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
              <span class="text-slate-300"
                >Axial tilt: ${planet.axialTilt.toFixed(2)}&deg;</span
              >
            </li>
          `;
    // Characteristics
    perihelion.innerHTML = `
            ${(planet.perihelion / 1000000).toFixed(1)}M km
          `;
    aphelion.innerHTML = `${(planet.aphelion / 1000000).toFixed(1)}M km`;
    eccentricity.innerHTML = `${planet.eccentricity.toFixed(5)}`;
    inclination.innerHTML = `${planet.inclination.toFixed(2)}&deg;`;
    axialTilt.innerHTML = `${planet.axialTilt.toFixed(2)}&deg;`;
    temp.innerHTML = `${planet.avgTemp}&deg;C`;
    _escape.innerHTML = `${(planet.escape / 1000).toFixed(2)} km/s`;
    // Comparison
    planetList.forEach((planet) => {});
  }
}

// Load All Functions
(async () => {
  navLinksF();
  mobileNavF();
  dateInputsF();
  try {
    await getApod();
    await getLaunches();
    await getPlanets();
  } catch {
    document.body.innerHTML = `
    <div
      style="height:100vh; display:flex; justify-content:center; align-items:center;"
    >
      <p style="font-size:2rem; text-align:center">
        There was an error while fetching data, please try reloading the website.
      </p>
    </div>
    `;
  }
  displayApod();
  displayLaunches();
  displayPlanets();
})();
