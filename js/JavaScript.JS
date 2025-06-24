document.addEventListener("DOMContentLoaded", () => {
  const settingsLink = document.querySelector('[data-page="settings"]');
  const dropdown = document.getElementById('settings-dropdown');
  const pageList = document.getElementById('dynamic-pages');
  const searchResults = document.getElementById('searchResults');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  // Toggle dropdown
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('hidden');
  });

  // Populate Pages and Search
  allNavLinks.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = link.textContent;
    li.appendChild(a);
    pageList.appendChild(li);
    searchResults.appendChild(li.cloneNode(true));
  });

  // Dark mode toggle
  window.toggleDarkMode = function () {
    document.body.classList.toggle('dark-mode');
  };

  // Dyslexic font toggle
  window.toggleDyslexicFont = function () {
    document.body.classList.toggle('dyslexic-font');
  };

  // Search filter
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const items = searchResults.querySelectorAll('li');
    items.forEach(item => {
      item.style.display = item.textContent.toLowerCase().includes(value) ? '' : 'none';
    });
  });
});
function loadProjectCards() {
    const container = document.getElementById("project-cards");
    if (!container) return;

    container.innerHTML = ""; // Clear before rendering
    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "section";
        card.innerHTML = `
      <a href="${project.link}" class="card-link" target="_blank">
        <img src="${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </a>
    `;
        container.appendChild(card);
    });
}

function renderFullProjects() {
    const container = document.querySelector(".projects-page");
    if (!container) return;

    container.innerHTML = ""; // Clear before rendering
    projects.forEach((project, index) => {
        const isEven = index % 2 === 0;
        const bgClass = isEven ? "alt-bg-1" : "alt-bg-2";
        const layoutClass = isEven ? "left-image" : "right-image";

        const section = document.createElement("section");
        section.className = `project-section ${bgClass}`;
        section.innerHTML = `
      <div class="project-content ${layoutClass}">
        <div class="media-wrapper">
          <img src="${project.image}" alt="${project.title}" />
          <video src="${project.video}" muted loop></video>
        </div>
        <div class="project-text">
          <h2>${project.title}</h2>
          <p>${project.description}</p>
        </div>
      </div>
    `;
        container.appendChild(section);
    });
}

async function loadPage(pageName) {
    try {
        const res = await fetch(`/pages/${pageName}.html`);
        if (!res.ok) throw new Error(`Failed to load ${pageName}: ${res.status}`);

        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newContent = doc.querySelector("#main-content");
        if (!newContent) throw new Error(`No #main-content in ${pageName}.html`);

        const currentMain = document.querySelector("#main-content");
        if (currentMain) currentMain.innerHTML = newContent.innerHTML;

        handlePageSpecificRendering(pageName);
        rebindNavLinks();
    } catch (err) {
        console.error(err);
        const currentMain = document.querySelector("#main-content");
        if (currentMain) {
            currentMain.innerHTML = `<p>Error loading <strong>${pageName}</strong>. Page not found.</p>`;
        }
    }
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Grab values
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Simple validation
    if (!name || !email || !message) {
      status.textContent = "Please fill out all fields.";
      status.style.color = "red";
      return;
    }

    if (!validateEmail(email)) {
      status.textContent = "Invalid email address.";
      status.style.color = "red";
      return;
    }

    // Simulate success
    status.textContent = "Message sent successfully!";
    status.style.color = "green";

    // Clear form
    form.reset();
  });
}

// Basic email validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handlePageSpecificRendering(pageName) {
    switch (pageName) {
        case "home":
            loadProjectCards();
            break;
        case "projects":
            renderFullProjects();
            break;
        case "contact":
            initContactForm();
            break;
        default:
            break;
    }
}

function rebindNavLinks() {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) loadPage(page);
        });
    });
}

// Initial binding on page load
document.addEventListener("DOMContentLoaded", () => {
    rebindNavLinks();
    handlePageSpecificRendering("home"); // or whatever initial page is preloaded
});
