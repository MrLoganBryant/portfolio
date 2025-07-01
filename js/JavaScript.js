document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('settings-toggle');
    const dropdown = document.getElementById('settings-dropdown');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const pagesSection = document.getElementById('pages-section');

    const pages = [
        { name: 'Home', href: '/home' },
        { name: 'About', href: '/about' },
        { name: 'Projects', href: '/projects' },
        { name: 'Contact', href: '/contact' }
    ];

    pages.forEach(p => {
        const a = document.createElement('a');
        a.href = p.href;
        a.textContent = p.name;
        pagesSection.appendChild(a.cloneNode(true));
        searchResults.appendChild(a.cloneNode(true));
    });

    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('show');
        toggle.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
            dropdown.classList.remove('show');
            toggle.classList.remove('open');
        }
    });

    // Close on link click inside dropdown
    dropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            dropdown.classList.remove('show');
            toggle.classList.remove('open');
        }
    });

    // Search filter
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const items = searchResults.querySelectorAll('a');
        items.forEach(link => {
            const match = link.textContent.toLowerCase().includes(term);
            link.style.display = match ? 'block' : 'none';
        });
    });

    // Accessibility
    window.toggleDyslexicFont = () => {
        document.body.classList.toggle('dyslexic-font');
    };
});
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('settings-toggle');
    const dropdown = document.getElementById('settings-dropdown');
    const content = document.querySelector('.main-content');
    console.log("Dropdown:", dropdown);
    console.log("Content:", content);
    function adjustContentPadding() {
        const dropdownHeight = dropdown.classList.contains('show') ? dropdown.offsetHeight : 0;
        content.style.paddingBottom = `${dropdownHeight}px`;
    }

    toggle.addEventListener('click', () => {
        setTimeout(adjustContentPadding, 400); // delay to match dropdown animation
    });

    window.addEventListener('resize', adjustContentPadding);
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
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth" // This makes the scroll animated and smooth
        });
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
  function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  }
  
 //for dynamic card adding 
  const projects = [
    {
        title: "Project 1",
        description: "Description of project 1",
        image: "path/to/image1.jpg",
        link: "https://example.com/project1"
    },
    {
        title: "Project 2",
        description: "Description of project 2",
        image: "path/to/image2.jpg",
        link: "https://example.com/project2"
    },
    {
        title: "Project 3",
        description: "Description of project 3",
        image: "path/to/image2.jpg",
        link: "https://example.com/project2"
    },
    // can add more projects here as needed
];