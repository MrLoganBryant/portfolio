
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

function loadProjects() {
    const container = document.getElementById("project-cards");

    if (!container) {
        console.error("Project container not found!");
        return;
    }

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

document.addEventListener("DOMContentLoaded", loadProjects);

async function loadPageContent(page) {
    try {
        const response = await fetch(page);
        const html = await response.text();

        // Parse the fetched HTML as a document
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Get the new body content
        const newBodyContent = doc.body.innerHTML;

        // Replace current body content
        document.body.innerHTML = newBodyContent;

        // (Optional) Reattach any JS if needed
        // reinit(); // e.g. rebind listeners
    } catch (error) {
        console.error('Error loading page:', error);
        document.body.innerHTML = `<p>Failed to load ${page}</p>`;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            loadPageContent(page);
        });
    });
    
});

