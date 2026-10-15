const elements = document.querySelectorAll(
    ".section, .project-card, .skill-category"
);


const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);


elements.forEach((element) => {

    element.style.opacity = "0";

    element.style.transform = "translateY(30px)";

    element.style.transition =
        "opacity 0.8s ease, transform 0.8s ease";

    observer.observe(element);

});


const style = document.createElement("style");

style.textContent = `

    .show {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

`;

document.head.appendChild(style);

/* =========================
   Skill Stars
========================= */

const starContainers = document.querySelectorAll(".stars");


starContainers.forEach((container) => {

    const rating = parseFloat(
        container.dataset.rating
    );

    container.innerHTML = "";


    for (let i = 1; i <= 5; i++) {

        const star = document.createElement("span");

        star.classList.add("star");


        let fill = 0;


        if (rating >= i) {

            fill = 100;

        } else if (rating >= i - 0.5) {

            fill = 50;

        }


        star.style.setProperty(
            "--fill",
            `${fill}%`
        );


        container.appendChild(star);

    }

});


function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character]);
}


function renderProject(project) {
    const cardClasses = ["project-card"];

    if (project.featured) {
        cardClasses.push("featured");
    }

    const overview = project.overview.map((item) => `
        <div class="overview-item">
            <span class="overview-label">${escapeHtml(item.label)}</span>
            <h4>${escapeHtml(item.heading)}</h4>
            <p>${escapeHtml(item.description)}</p>
        </div>
    `).join("");

    const features = project.features.map((feature, index) => `
        <div class="feature-item">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <p>${escapeHtml(feature)}</p>
        </div>
    `).join("");

    const competitors = project.competitors.length
        ? `
            <div class="project-competitors">
                <span class="competitor-label">COMPETITORS</span>
                <div class="competitor-tags">
                    ${project.competitors.map((competitor) => `<span>${escapeHtml(competitor)}</span>`).join("")}
                </div>
            </div>
        `
        : "";

    const technologies = project.technologies
        .map((technology) => `<span>${escapeHtml(technology)}</span>`)
        .join("");

    const links = project.links.map((link) => {
        const variant = link.variant === "secondary" ? " secondary" : "";
        const targetAttributes = /^https?:\/\//i.test(link.url)
            ? ' target="_blank" rel="noopener noreferrer"'
            : "";
        return `
            <a href="${escapeHtml(link.url)}" class="project-link${variant}"${targetAttributes}>
                ${escapeHtml(link.label)}
            </a>
        `;
    }).join("");

    return `
        <article class="${cardClasses.join(" ")}">
            <div class="project-image ${escapeHtml(project.imageClass || "")} ">
                <div class="project-number">${escapeHtml(project.number)}</div>
                <div class="project-image-text">${escapeHtml(project.imageLabel)}</div>
            </div>
            <div class="project-content">
                <p class="project-type">${escapeHtml(project.type)}</p>
                <h3>${escapeHtml(project.title)}</h3>
                <div class="project-overview">${overview}</div>
                <div class="project-section">
                    <h4 class="project-section-title">主要機能</h4>
                    <div class="feature-list">${features}</div>
                </div>
                <div class="project-strength">
                    <span class="strength-label">${escapeHtml(project.highlight.label)}</span>
                    <h4>${escapeHtml(project.highlight.title)}</h4>
                    <p>${escapeHtml(project.highlight.description)}</p>
                </div>
                ${competitors}
                <div class="project-section">
                    <h4 class="project-section-title">開発について</h4>
                    <p>${escapeHtml(project.development)}</p>
                </div>
                <div class="project-tags">${technologies}</div>
                <div class="project-links">${links}</div>
            </div>
        </article>
    `;
}


fetch("projects.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Projects data request failed: ${response.status}`);
        }

        return response.json();
    })
    .then((projects) => {
        const projectsGrid = document.querySelector("#projects-grid");
        projectsGrid.innerHTML = projects.map(renderProject).join("");

        projectsGrid.querySelectorAll(".project-card").forEach((card) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";
            card.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            observer.observe(card);
        });
    })
    .catch((error) => {
        console.error("Unable to load projects.json", error);
    });
