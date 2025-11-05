let characters = [];

async function loadCharacters() {
  try {
    const res = await fetch('characters.json');
    const allChars = await res.json();

    characters = allChars.filter(char => char.role === currentRole);
    renderCharacterButtons();
    showCharacter(0);
  } catch (err) {
    console.error("載入角色資料失敗", err);
  }
}

function renderCharacterButtons() {
  const list = document.querySelector('.character-list');
  list.innerHTML = '';

  characters.forEach((char, index) => {
    const btn = document.createElement('button');
    btn.className = 'character-button';
    btn.innerHTML = `
      <img src="${char.image}" alt="${char.name}">
      <span>${char.name}</span>
    `;
    btn.onclick = () => showCharacter(index);
    list.appendChild(btn);
  });
}

function showCharacter(index) {
  const char = characters[index];

  document.getElementById('char-name').textContent = char.name;
  document.getElementById('char-country').textContent = char.country;
  document.getElementById('char-story').textContent = char.story;
  document.getElementById('char-image').src = char.image;

  const bg = document.getElementById('character-container');
  bg.style.backgroundImage = `url('${char.background}')`;

  document.querySelectorAll('.character-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.character-button')[index].classList.add('active');
}

window.onload = loadCharacters;
