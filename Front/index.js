const API_BASE_URL = 'http://localhost:3000/api';

const form = document.querySelector('#item-form');
const nameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const itemsList = document.querySelector('#items-list');
const message = document.querySelector('#message');
const submitButton = form.querySelector('button');

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function renderItems(items) {
  itemsList.replaceChildren();

  if (items.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Aucun élément enregistré.';
    itemsList.append(emptyMessage);
    return;
  }

  items.forEach((item) => {
    const listItem = document.createElement('li');
    const title = document.createElement('strong');
    const description = document.createElement('p');

    title.textContent = item.name;
    description.textContent = item.description || 'Sans description';
    listItem.append(title, description);
    itemsList.append(listItem);
  });
}

async function loadItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Impossible de charger les éléments.');
    }

    renderItems(data);
  } catch (error) {
    showMessage(error.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  showMessage('');

  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value,
        description: descriptionInput.value,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Impossible de créer l’élément.');
    }

    form.reset();
    showMessage('Élément ajouté avec succès.');
    await loadItems();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});

loadItems();