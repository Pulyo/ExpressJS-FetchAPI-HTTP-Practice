const handleInput = ({ target }) => {
  target.setAttribute("value", target.value);
}

const loadEvent = () => {
  fetchData("http://localhost:3000/api/users/").then((data) => {
    listAll(data);
    window.addEventListener("input", handleInput);
  });
};
window.addEventListener("load", loadEvent);

async function fetchData(url) {
  try {
    const rawData = await fetch(url);
    const data = await rawData.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function createHTMLElement(elementHTML, content = "", id = "") {
  const element = document.createElement(elementHTML);
  element.innerHTML = content;
  element.id = id;
  return element;
}

function listAll(data) {
  const root = document.querySelector("#root");
  root.innerHTML = "";
  data.map((user) => {
    const userDiv = createHTMLElement("div");
    userDiv.append(createHTMLElement("li", `ID: ${user.id}`));
    userDiv.append(createHTMLElement("li", `Name: ${user.name}`));
    userDiv.append(createHTMLElement("li", `Age: ${user.age}`));
    // Delete button
    const deleteButton = createHTMLElement("button", "DELETE");
    deleteButton.addEventListener("click", async () => {
      try {
        await fetch(`http://localhost:3000/api/users/${user.id}`, {
          method: "DELETE",
        });
        loadEvent();
      } catch (error) {
        console.log(error);
      }
    });
    userDiv.append(deleteButton);
    // Editing user (PUT and PATCH)
    const editUserBtn = createHTMLElement("button", "Edit user");
    editUserBtn.addEventListener("click", () => {
      document.querySelector(`#put${user.id}`).style.display = "block";
    });
    userDiv.append(editUserBtn);
    userDiv.append(createModal("put", user.id));

    root.append(userDiv);
  });
}

function createModal(nameOfModal, id) {
  const form = createHTMLElement("form");
  form.id = nameOfModal + id;
  const nameLabel = createHTMLElement("label", "Name:", "nameLabel");
  form.appendChild(nameLabel);
  const nameInput = createHTMLElement("input");
  nameInput.name = "name";
  form.appendChild(nameInput);
  const ageLabel = createHTMLElement("label", "Age:", "ageLabel");
  form.appendChild(ageLabel);
  const ageInput = createHTMLElement("input");
  ageInput.name = "age";
  form.appendChild(ageInput);
  const submitButton = createHTMLElement("button", "PUT");
  submitButton.type = "submit";
  const updateFieldOnlyButton = createHTMLElement("button", "PATCH");
  updateFieldOnlyButton.type = "submit";

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      let newData = { id: id, name: nameInput.value, age: ageInput.value };
      console.log(newData);
      const respons = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      loadEvent();
    } catch (error) {
      console.log(error);
    }
  });

  updateFieldOnlyButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      let patchData = { id: id };
      if (nameInput.value !== "") {
        patchData.name = nameInput.value;
      }
      if (ageInput.value !== "") {
        patchData.age = ageInput.value;
      }
      const respons = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      loadEvent();
    } catch (error) {
      console.log(error);
    }
  })

  form.appendChild(submitButton);
  form.appendChild(updateFieldOnlyButton);
  form.style.display = "none";
  return form;
}