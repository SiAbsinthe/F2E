let characters = [];
let myGlobe;
let selectedIndex = -1;

const countryCoords = {
  "迦納 GHA": { lat: 7.9, lng: -1.0 },
  "印度 IND": { lat: 20.5, lng: 78.9 },
  "美國 USA": { lat: 37.0, lng: -95.7 },
  "蘇格蘭 SCO": { lat: 56.4, lng: -4.2 },
  "英國 UK": { lat: 55.3, lng: -3.4 },
  "韓國 KR": { lat: 35.9, lng: 127.7 },
  "巴西 BRA": { lat: -14.2, lng: -51.9 },
  "墨西哥 MEX": { lat: 23.6, lng: -102.5 },
  "日本 JP": { lat: 36.2, lng: 138.2 },
  "菲律賓 PHI": { lat: 12.8, lng: 121.7 },
  "中國 CHN": { lat: 35.8, lng: 104.1 },
  "摩洛哥 MAR": { lat: 31.7, lng: -7.0 },
  "德國 GER": { lat: 51.1, lng: 10.4 },
  "法國 FRA": { lat: 46.2, lng: 2.2 },
  "挪威 NOR": { lat: 60.4, lng: 8.4 },
  "俄羅斯 RUS": { lat: 61.5, lng: 105.3 },
  "瑞典 SWE": { lat: 60.1, lng: 18.6 },
  "澳洲 AUS": { lat: -25.2, lng: 133.7 },
  "土耳其 TUR": { lat: 38.9, lng: 35.2 },
  "哥倫比亞 COL": { lat: 4.5, lng: -74.0 },
  "泰國 THA": { lat: 15.8, lng: 100.9 },
  "塞內加爾 SEN": { lat: 14.5, lng: -14.4 },
  "越南 VNM": { lat: 14.0, lng: 108.0 },
  "未知 UNK": { lat: 25.0, lng: -40.0 }
};

async function loadCharacters() {
  try {
    const res = await fetch('characters.json');
    const allChars = await res.json();
    characters = allChars.filter(char => char.role === currentRole);
    
    renderCharacterButtons();
    initGlobe(); 
    if (characters.length > 0) showCharacter(0); 
  } catch (err) {
    console.error("載入失敗", err);
  }
}

function initGlobe() {
  const container = document.getElementById('globeViz');
  myGlobe = Globe()(container)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .ringsData([]) 
    .ringLat(d => countryCoords[d.country]?.lat || 25.0)
    .ringLng(d => countryCoords[d.country]?.lng || -40.0)
    .ringColor(() => '#ff4655')
    .ringMaxRadius(10)
    .ringPropagationSpeed(3)
    .ringRepeatPeriod(1000)
    .width(container.offsetWidth)
    .height(container.offsetHeight);

  myGlobe.controls().autoRotate = true;
  myGlobe.controls().autoRotateSpeed = 0.5;

  window.addEventListener('resize', () => {
    myGlobe.width(container.offsetWidth);
    myGlobe.height(container.offsetHeight);
  });
}

function renderCharacterButtons() {
  const list = document.querySelector('.character-list');
  list.innerHTML = '';
  characters.forEach((char, index) => {
    const btn = document.createElement('button');
    btn.className = 'character-button';
    btn.innerHTML = `<img src="${char.image}"><span>${char.name.split(' ')[0]}</span>`;
    btn.onclick = () => showCharacter(index);
    list.appendChild(btn);
  });
}

function showCharacter(index) {
  const char = characters[index];
  if (!char) return;

  // --- 動畫 ---
  const infoCard = document.getElementById('info-card');
  infoCard.classList.remove('content-fade-in');
  void infoCard.offsetWidth; 
  infoCard.classList.add('content-fade-in');

  // 更新介面資訊
  document.getElementById('char-name').textContent = char.name;
  document.getElementById('char-country').textContent = char.country;
  document.getElementById('char-story').textContent = char.story;
  document.getElementById('char-image').src = char.background;

  const bg = document.getElementById('character-container');
  bg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${char.background}')`;

  selectedIndex = index;
  myGlobe.ringsData([char]); 

  const coords = countryCoords[char.country] || countryCoords["未知 UNK"];
  if (myGlobe) {
    myGlobe.controls().autoRotate = false; 
    const alt = window.innerWidth < 768 ? 2.5 : 2;
    myGlobe.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: alt }, 1500);
  }

  const buttons = document.querySelectorAll('.character-button');
  buttons.forEach(b => b.classList.remove('active'));
  if (buttons[index]) {
    buttons[index].classList.add('active');
    if (window.innerWidth < 768) {
      buttons[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
}

window.onload = loadCharacters;