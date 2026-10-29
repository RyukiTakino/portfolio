// 画面に表示される要素に対して、スクロールで見えるようになった時だけ
// アニメーションを適用するための監視処理。
const elements = document.querySelectorAll(
    ".section, .project-card, .skill-category"
);

// IntersectionObserver を使って、対象要素が画面内に入ったかを検知する。
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


// 初期状態では非表示にして、画面に入った時に .show を付けて表示させる。
elements.forEach((element) => {

    element.style.opacity = "0";

    element.style.transform = "translateY(30px)";

    element.style.transition =
        "opacity 0.8s ease, transform 0.8s ease";

    observer.observe(element);

});

// .show が付いた時の見た目を CSS で定義して、滑らかな入場アニメーションにする。
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
   各スキルの評価を星アイコンで表示する処理
========================= */

// .stars を持つ要素を全て取得し、data-rating の値に応じて星の塗りつぶし具合を決める。
const starContainers = document.querySelectorAll(".stars");


starContainers.forEach((container) => {

    // 例: 4.5 なら 5つ星のうち4つ半分埋めるように表示する。
    const rating = parseFloat(
        container.dataset.rating
    );

    // 既存の星要素を消してから、 rating に応じて新しく生成し直す。
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


// HTML にそのまま挿入するテキストが悪意のあるコードにならないように
// 特殊文字をエスケープして安全に表示するための補助関数。
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character]);
}

// 1件のプロジェクト情報を受け取り、カード用の HTML を組み立てる。
function renderProject(project) {
    const cardClasses = ["project-card"];

    if (project.featured) {
        cardClasses.push("featured");
    }

    const overview = project.overview.map((item) => `
        <div class="overview-item">
            <h4>${escapeHtml(item.heading || item.label)}</h4>
            <p>${escapeHtml(item.description)}</p>
        </div>
    `).join("");

    // 制作経緯を表示するHTMLを生成
    const background = project.background
        ? `
        <div class="project-section project-background">
            <h4 class="project-section-title">
                ${escapeHtml(project.background.title)}
            </h4>
            <p>${escapeHtml(project.background.description)}</p>
        </div>
    `
    : "";

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

    function escapeHTML(value) {
return String(value).replace(/[&<>"']/g, (char) => {
const entities = {
"&": "&",
"<": "<",
">": ">",
'"': '"',
"'": "'"
};
    return entities[char];
});

}


    function renderDevelopment(development) {
    if (!development || typeof development !== "object") {
    return "";
    }

    const sections = [
        {
            key: "overview",
            title: "開発概要"
        },
        {
            key: "responsibilities",
            title: "自分が担当した開発詳細"
        },
        {
            key: "roadmap",
            title: "今後の開発予定"
        }
    ];

    return `
        <div class="development-details">
            ${sections.map((section) => {
                const items = development[section.key];

                if (!Array.isArray(items) || items.length === 0) {
                    return "";
                }

                return `
                    <section class="development-section development-section--${section.key}">
                        <h4 class="development-section__title">
                            ${escapeHTML(section.title)}
                        </h4>

                        <ul class="development-section__list">
                            ${items.map((item) => `
                                <li>
                                    ${escapeHTML(item)}
                                </li>
                            `).join("")}
                        </ul>
                    </section>
                `;
            }).join("")}
        </div>
`;

}


    return `
        <article class="${cardClasses.join(" ")}">
            <div class="project-image ${escapeHtml(project.imageClass || "")}">
    <div class="project-number">
            ${escapeHtml(project.number)}
        </div>

        <div class="project-image-text">
            ${escapeHtml(project.title)}
        </div>
    </div>
            <div class="project-content">
                <p class="project-type">${escapeHtml(project.type)}</p>
                <h3>${escapeHtml(project.title)}</h3>
                <div class="project-overview">${overview}</div>
                ${background}
                <div class="project-section">
                    <h4 class="project-section-title">主要機能</h4>
                    <div class="feature-list">${features}</div>
                </div>
                <div class="project-strength">
                    <span class="strength-label">${escapeHtml(project.highlight.label)}</span>
                    <h4>${escapeHtml(project.highlight.title)}</h4>
                    <p>${escapeHtml(project.highlight.description)}</p>
                </div>
                <div class="project-section">
                    <h4 class="project-section-title">開発について</h4>
                    ${renderDevelopment(project.development)}
                </div>
                <div class="project-tags">${technologies}</div>
                <div class="project-links">${links}</div>
            </div>
        </article>
    `;
}


// JSON から作品データを取得して、ページに表示する処理。
fetch("projects.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Projects data request failed: ${response.status}`);
        }

        return response.json();
    })
    .then((projects) => {
    const projectsGrid = document.querySelector("#projects-grid");

    // ① featured: true の作品を優先的に上に表示する
    // ② 同じ優先度なら number の小さい順に並べる
    projects.sort((a, b) => {
        const featuredOrder =
            Number(b.featured) - Number(a.featured);

        if (featuredOrder !== 0) {
            return featuredOrder;
        }

        return Number(a.number) - Number(b.number);
    });

    // 並べ替えた順序で各作品のカードHTMLを生成して、グリッドに埋め込む。
    projectsGrid.innerHTML = projects.map(renderProject).join("");

    // 新しく追加したカードにも、他の要素と同じようにスクロールでふわっと表示するアニメーションを付与する。
    projectsGrid.querySelectorAll(".project-card").forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

        observer.observe(card);
    });
})
    .catch((error) => {
        console.error("Unable to load projects.json", error);
    });
