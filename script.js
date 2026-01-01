let currentTab = '';
const savedSnippets = JSON.parse(localStorage.getItem('savedSnippets')) || [];
const searchInput = document.getElementById('globalSearch');

const profile = document.getElementById('profileImg');
profile.addEventListener('click', () => {
  window.location.href = 'https://BananaBrother77.github.io/AboutMe/';
});

function initStaticDeleteButtons() {
  const staticDeleteBtns = document.querySelectorAll('.delete-btn');
  staticDeleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.snippet-card');
      if (card && confirm("Do you want to delete this snippet?")) {
        card.remove();
      }
    });
  });
}

searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase().trim();
  const homeSection = document.getElementById('home');
  const allTabs = document.querySelectorAll('.tab');
  const allCards = document.querySelectorAll('.snippet-card');
  
  if (term === "") {
    allTabs.forEach(tab => {
      tab.style.display = tab.classList.contains('is-active') ? 'block' : 'none';
    });
    allCards.forEach(card => card.style.display = 'block');
    const activeBtn = document.querySelector('.nav-btns button.active-nav');
    if (activeBtn) moveNavIndicator(activeBtn);
    return;
  }
  
  if (homeSection) homeSection.style.display = 'none';
  
  allCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
  
  let firstFoundTabId = null;
  allTabs.forEach(tab => {
    if (tab.id === 'home') return;
    const hasVisibleCards = Array.from(tab.querySelectorAll('.snippet-card'))
      .some(card => card.style.display === 'block');
    tab.style.display = hasVisibleCards ? 'block' : 'none';
    if (hasVisibleCards && !firstFoundTabId) firstFoundTabId = tab.id;
  });
  
  if (firstFoundTabId) {
    const matchingNavBtn = document.querySelector(`.nav-btns button[data-target="${firstFoundTabId}"]`);
    if (matchingNavBtn) moveNavIndicator(matchingNavBtn);
  }
});

function moveNavIndicator(btn) {
  const indicator = document.querySelector('.nav-indicator');
  if (indicator && btn) {
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.left = btn.offsetLeft + "px";
  }
}

function changeSection() {
  const tabBtns = document.querySelectorAll('.card, .nav-btns button');
  const allTabs = document.querySelectorAll('.tab');
  const navButtons = document.querySelectorAll('.nav-btns button');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      searchInput.value = "";
      document.querySelectorAll('.snippet-card').forEach(c => c.style.display = 'block');
      
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      
      if (target) {
        allTabs.forEach(tab => {
          tab.classList.remove('is-active');
          tab.style.display = 'none';
        });
        target.classList.add('is-active');
        target.style.display = 'block';
        
        navButtons.forEach(navBtn => {
          navBtn.classList.remove('active-nav');
          if (navBtn.getAttribute('data-target') === targetId) {
            navBtn.classList.add('active-nav');
            moveNavIndicator(navBtn);
          }
        });
        currentTab = target;
        window.scrollTo(0, 0);
      }
    });
  });
}

function createSnippetCard() {
  if (!currentTab) return;
  const newSnippet = {
    id: Date.now(),
    name: cardNameInput.value.trim(),
    desc: cardDescInput.value.trim(),
    code: cardCodeInput.value.trim(),
    category: currentTab.id
  };
  savedSnippets.push(newSnippet);
  renderCard(newSnippet);
  localStorage.setItem('savedSnippets', JSON.stringify(savedSnippets));
  cancelAddCodeMenu();
}

function showAddCodeMenu() {
  const addCardBtns = document.querySelectorAll('.add-card');
  const addCodeMenu = document.getElementById('addCodeMenu');
  const addCodeOverlay = document.getElementById('overlay');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  
  addCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      addCodeMenu.classList.add('is-visible');
      addCodeOverlay.classList.add('is-visible');
    });
  });
  
  cancelBtn.addEventListener('click', () => cancelAddCodeMenu());
  confirmBtn.addEventListener('click', () => confirmAddingCode());
}

function cancelAddCodeMenu() {
  const addCodeMenu = document.getElementById('addCodeMenu');
  const addCodeOverlay = document.getElementById('overlay');
  
  document.getElementById('cardName').value = '';
  document.getElementById('cardDesc').value = '';
  document.getElementById('cardCode').value = '';
  
  addCodeMenu.classList.remove('is-visible');
  addCodeOverlay.classList.remove('is-visible');
}


function renderCard(snippet) {
  const targetTab = document.getElementById(snippet.category);
  if (!targetTab) return;
  
  const card = document.createElement('div');
  card.classList.add('snippet-card');
  card.innerHTML = `
    <div class="card-header">
      <h3 class="snippet-title"></h3>
      <button class="delete-btn">&times;</button>
    </div>
    <div class="separator"></div>
    <p class="title-desc"></p>
    <div class="code-display">
      <pre><code></code></pre>
    </div>
  `;
  
  card.querySelector('.snippet-title').textContent = snippet.name;
  card.querySelector('.title-desc').textContent = snippet.desc;
  card.querySelector('code').textContent = snippet.code;
  
  card.querySelector('.delete-btn').addEventListener('click', () => {
    if (confirm("Delete this snippet?")) {
      const index = savedSnippets.findIndex(s => s.id === snippet.id);
      if (index !== -1) {
        savedSnippets.splice(index, 1);
        localStorage.setItem('savedSnippets', JSON.stringify(savedSnippets));
      }
      card.remove();
    }
  });
  targetTab.appendChild(card);
}

function loadSavedSnippets() {
  savedSnippets.forEach(snippet => renderCard(snippet));
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedSnippets();
  initStaticDeleteButtons();
  changeSection();
  showAddCodeMenu();
  currentTab = document.querySelector('.tab.is-active');
});