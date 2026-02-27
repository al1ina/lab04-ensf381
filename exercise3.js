const users_api = "https://69a1e70c2e82ee536fa28b3c.mockapi.io/users";

// DOM selectors
const userGrid = document.getElementById("userGrid");

const viewToggleBtn = document.getElementById("viewToggleBtn");

const deleteIdInput = document.getElementById("deleteIdInput");

const deleteBtn = document.getElementById("deleteBtn");

const sortByGroupBtn = document.getElementById("sortByGroupBtn");

const sortByIdBtn = document.getElementById("sortByIdBtn");

let users = [];

async function retrieveData() {
  try {
    const response = await fetch(users_api);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    users = data;          
    console.log(users);    
    render(users);        

  } catch (error) {
    console.error("Error retrieving data:", error);
  }
}

function render(usersArray) {

  userGrid.innerHTML = "";

  usersArray.forEach(user => {

    const userCard = `
      <article class="user-card">
        <h3>${user.first_name ?? ""}</h3>
        <p>first_name: ${user.first_name ?? ""}</p>
        <p>user_group: ${user.user_group ?? ""}</p>
        <p>id: ${user.id ?? ""}</p>
      </article>
    `;

    userGrid.innerHTML += userCard;

  });
}

viewToggleBtn.addEventListener("click", () => {

  if (userGrid.classList.contains("grid-view")) {
    
    userGrid.classList.remove("grid-view");
    userGrid.classList.add("list-view");

  } else if (userGrid.classList.contains("list-view")) {
    
    userGrid.classList.remove("list-view");
    userGrid.classList.add("grid-view");

  }

});

sortByGroupBtn.addEventListener("click", () => {

  users.sort((a, b) => {
    return a.user_group.localeCompare(b.user_group);
  });

  render(users);

});


sortByIdBtn.addEventListener("click", () => {

  users.sort((a, b) => {
    return Number(a.id) - Number(b.id);
  });

  render(users);

});

deleteBtn.addEventListener("click", async () => {
  const idToDelete = deleteIdInput.value.trim();

  if (!idToDelete || Number(idToDelete) <= 0) {
    console.error("Delete failed: invalid ID input.");
    return;
  }

  const exists = users.some(u => String(u.id) === String(idToDelete));
  if (!exists) {
    console.error(`Delete failed: no user found with id ${idToDelete}.`);
    return;
  }

  try {
    const deleteUrl = `${users_api}/${idToDelete}`;

    const response = await fetch(deleteUrl, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    users = users.filter(u => String(u.id) !== String(idToDelete));
    render(users);

    deleteIdInput.value = "";

  } catch (err) {
    console.error(`Delete failed: could not delete user id ${idToDelete}.`, err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  retrieveData();
});
