let currentTab = null;
const savedSnippets = JSON.parse(localStorage.getItem('savedSnippets')) || [];
const searchInput = document.getElementById('globalSearch');

const cardNameInput = document.getElementById('cardName');
const cardDescInput = document.getElementById('cardDesc');
const cardCodeInput = document.getElementById('cardCode');

const profile = document.querySelector('.profile-img');
if (profile) {
  profile.addEventListener('click', () => {
    window.location.href = 'https://BananaBrother77.github.io/AboutMe/';
  });
}

function initStaticDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest('.snippet-card');
      if (card && confirm("Do you want to delete this static snippet?")) {
        card.remove();
      }
    };
  });
}

function initStaticCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest('.snippet-card');
      const codeToCopy = card.querySelector('code').textContent;
      navigator.clipboard.writeText(codeToCopy);
    };
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
    const matchingBtn = document.querySelector(`.nav-btns button[data-target="${firstFoundTabId}"]`);
    if (matchingBtn) moveNavIndicator(matchingBtn);
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

function confirmAddingCode() {
  if (!currentTab || currentTab.id === 'home') {
    alert("Please select a category first!");
    return;
  }
  
  if (!cardNameInput.value || !cardCodeInput.value) {
    alert("Name and Code are required!");
    return;
  }
  
  const newSnippet = {
    id: Date.now(),
    name: cardNameInput.value.trim(),
    desc: cardDescInput.value.trim(),
    code: cardCodeInput.value.trim(),
    category: currentTab.id
  };
  
  savedSnippets.push(newSnippet);
  localStorage.setItem('savedSnippets', JSON.stringify(savedSnippets));
  renderCard(newSnippet);
  cancelAddCodeMenu();
}

function showAddCodeMenu() {
  const addCardBtns = document.querySelectorAll('.add-card');
  const addCodeMenu = document.getElementById('addCodeMenu');
  const addCodeOverlay = document.getElementById('overlay');
  
  addCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      addCodeMenu.classList.add('is-visible');
      addCodeOverlay.classList.add('is-visible');
    });
  });
  
  document.getElementById('cancelBtn').onclick = cancelAddCodeMenu;
  document.getElementById('confirmBtn').onclick = confirmAddingCode;
}

function cancelAddCodeMenu() {
  document.getElementById('addCodeMenu').classList.remove('is-visible');
  document.getElementById('overlay').classList.remove('is-visible');
  cardNameInput.value = '';
  cardDescInput.value = '';
  cardCodeInput.value = '';
}

function renderCard(snippet) {
  const targetTab = document.getElementById(snippet.category);
  if (!targetTab) return;
  
  const card = document.createElement('div');
  card.classList.add('snippet-card');
  
  card.innerHTML = `
    <div class="card-header">
      <h3 class="snippet-title"></h3>
      <div class="header-actions">
        <img src="assets/img/copy-icon.png" class="copy-btn" title="Copy Code" />
        <button class="delete-btn">&times;</button>
      </div>
    </div>
    <div class="separator"></div>
    <p class="title-desc"></p>
    <div class="code-display">
      <pre><code class="language-${snippet.category}"></code></pre>
    </div>
  `;
  
  card.querySelector('.snippet-title').textContent = snippet.name;
  card.querySelector('.title-desc').textContent = snippet.desc;
  const codeElement = card.querySelector('code');
  codeElement.textContent = snippet.code;
  
  if (window.Prism) {
    Prism.highlightElement(codeElement);
  }
  
  card.querySelector('.delete-btn').onclick = () => {
    if (confirm("Delete this snippet?")) {
      const index = savedSnippets.findIndex(s => s.id === snippet.id);
      if (index !== -1) {
        savedSnippets.splice(index, 1);
        localStorage.setItem('savedSnippets', JSON.stringify(savedSnippets));
      }
      card.remove();
    }
  };
  
  card.querySelector('.copy-btn').onclick = () => {
    const codeToCopy = snippet.code;
    navigator.clipboard.writeText(codeToCopy);
  };
  
  targetTab.appendChild(card);
}


function loadSavedSnippets() {
  savedSnippets.forEach(snippet => renderCard(snippet));
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedSnippets();
  initStaticDeleteButtons();
  initStaticCopyButtons();
  changeSection();
  showAddCodeMenu();
  
  if (window.Prism) {
    Prism.highlightAll();
  }
  
  currentTab = document.querySelector('.tab.is-active');
  const activeBtn = document.querySelector('.nav-btns button.active-nav');
  if (activeBtn) {
    setTimeout(() => moveNavIndicator(activeBtn), 100);
  }
});