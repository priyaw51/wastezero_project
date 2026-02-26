function openDelete() {
    document.getElementById("deleteModal").style.display = "block";
}

function closeDelete() {
    document.getElementById("deleteModal").style.display = "none";
}

function deleteCard() {
    document.querySelector(".card").remove();
    closeDelete();
}
// Load opportunities when page loads
async function loadOpportunities() {
    const res = await fetch("http://localhost:5000/opportunities");
    const data = await res.json();

    const container = document.getElementById("opportunityContainer");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(op => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${op.title}</h3>
            <p>${op.description}</p>
            <p><strong>Date:</strong> ${op.date}</p>
            <p><strong>Location:</strong> ${op.location}</p>
            <div class="card-buttons">
                <a href="edit.html?id=${op._id}">
                    <button class="edit-btn">Edit</button>
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}

loadOpportunities();
