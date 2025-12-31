let currentTab = '';
const savedTabs = [];

function changeSection() {
  const tabBtns = document.querySelectorAll('.card');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const allTabs = document.querySelectorAll('.tab');
      const targetId = btn.getAttribute('data-target');
      currentTab = document.getElementById(targetId);
      
      if (currentTab) {
        allTabs.forEach(tab => tab.classList.remove('is-active'));
        currentTab.classList.add('is-active');
        void currentTab.offsetWidth;
        window.scrollTo(0, 0);
      }
      
    });
  });
}

const addCardBtn = document.getElementById('addCard');
const addCodeMenu = document.getElementById('addCodeMenu');
const addCodeOverlay = document.getElementById('overlay');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

const cardNameInput = document.getElementById('cardName');
const cardDescInput = document.getElementById('cardDesc');
const cardCodeInput = document.getElementById('cardCode');

function showAddCodeMenu() {
  addCardBtn.addEventListener('click', () => {
    addCodeMenu.classList.add('is-visible');
    addCodeOverlay.classList.add('is-visible');
  });
  
  cancelBtn.addEventListener('click', () => cancelAddCodeMenu());
  confirmBtn.addEventListener('click', () => confirmAddingCode());
}

function cancelAddCodeMenu() {
  cardNameInput.value = '';
  cardDescInput.value = '';
  cardCodeInput.value = '';
  
  addCodeMenu.classList.remove('is-visible');
  addCodeMenu.classList.add('is-closing');
  addCodeOverlay.classList.remove('is-visible');
  
  setTimeout(() => {
    addCodeMenu.classList.remove('is-closing');
  }, 300);
}

function confirmAddingCode() {
  if (cardNameInput.value.trim() !== '' && cardDescInput.value.trim() !== '' && cardCodeInput.value.trim() !== '') {
    createSnippetCard();
  } else {
    
  }
}

function createSnippetCard() {
  if (!currentTab) return;
  
  const newSnippet = {
    id: Date.now(),
    name: cardNameInput.value.trim(),
    desc: cardDescInput.value.trim(),
    code: cardCodeInput.value.trim(),
    category: currentTab.id
  }
  
  savedTabs.push(newSnippet);
  
  renderCard(newSnippet);
  
  localStorage.setItem('savedTabs', savedTabs);
  
  cancelAddCodeMenu();
}

function renderCard(snippet) {
  const targetTab = document.getElementById(snippet.category)
  if (!targetTab) return;
  
  const card = document.createElement('div');
  card.classList.add('snippet-card');
  
  card.innerHTML = `
    <h3 class="snippet-title"></h3>
    <div class="separator"></div>
    <p class="title-desc"></p>
    <div class="code-display">
      <pre><code></code></pre>
    </div>
  `;
  
  card.querySelector('.snippet-title').textContent = cardNameInput.value.trim();
  card.querySelector('.title-desc').textContent = cardDescInput.value.trim();
  card.querySelector('code').textContent = cardCodeInput.value.trim();
  
  targetTab.appendChild(card);
}



document.addEventListener('DOMContentLoaded', () => {
  changeSection();
  showAddCodeMenu();
});