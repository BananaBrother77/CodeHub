let currentTab = null;
const savedSnippets = JSON.parse(localStorage.getItem('savedSnippets')) || [];
const searchInput = document.getElementById('globalSearch');

const cardNameInput = document.getElementById('cardName');
const cardDescInput = document.getElementById('cardDesc');
const cardCodeInput = document.getElementById('cardCode');

const profile = document.getElementById('profileImg');
if (profile) {
  profile.addEventListener('click', () => {
    window.location.href = 'https://BananaBrother77.github.io/AboutMe/';
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById('toggle-btn');
  
  sidebar.classList.toggle("close");
  if (toggleButton) toggleButton.classList.toggle("rotate");

  if (sidebar.classList.contains("close")) {
    closeAllSubMenus();
  }
}

function toggleSubMenu(button) {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById('toggle-btn');
  const subMenu = button.nextElementSibling;
  
  if (!subMenu.classList.contains('show')) {
    closeAllSubMenus();
  }

  subMenu.classList.toggle("show");
  button.classList.toggle("rotate");

  if (sidebar.classList.contains('close')) {
    sidebar.classList.remove('close');
    if (toggleButton) toggleButton.classList.remove('rotate');
  }
}

function closeAllSubMenus() {
  const sidebar = document.getElementById("sidebar");
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show');
    if (ul.previousElementSibling) {
      ul.previousElementSibling.classList.remove('rotate');
    }
  });
}

function exportSnippets() {
  const exportBtn = document.getElementById('exportBtn');
  if (!exportBtn) return;
  
  exportBtn.onclick = () => {
    const jsonString = JSON.stringify(savedSnippets);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = "codehub_snippets.json";
    
    link.click();
    URL.revokeObjectURL(url);
  };
}

function importSnippets() {
  const importBtn = document.getElementById('importBtn');
  if (!importBtn) return;
  
  importBtn.onclick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          
          if (Array.isArray(importedData)) {
            const newItems = importedData.filter(importSnippet => {
              return !savedSnippets.some(existingSnippet => existingSnippet.id === importSnippet.id);
            });
            
            savedSnippets.push(...newItems);
            localStorage.setItem('savedSnippets', JSON.stringify(savedSnippets));
            newItems.forEach(snippet => renderCard(snippet));
            
            alert(`${newItems.length} new Snippets imported!`);
          }
        } catch (err) {
          alert("Error: The file is not a valid JSON.");
        }
      };
      reader.readAsText(file);
    };
    
    fileInput.click();
  };
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
    
    // Auf Mobile: Den Button in die Mitte scrollen, wenn er außerhalb des Sichtfelds ist
    if (window.innerWidth <= 768) {
      btn.parentElement.scrollTo({
        left: btn.offsetLeft - (btn.parentElement.offsetWidth / 2) + (btn.offsetWidth / 2),
        behavior: 'smooth'
      });
    }
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
  exportSnippets();
  importSnippets();
  initStaticDeleteButtons();
  initStaticCopyButtons();
  changeSection();
  showAddCodeMenu();
  
  if (window.Prism) {
    Prism.highlightAll();
  }
  
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) {
    setTimeout(() => {
      moveNavIndicator(homeBtn);
      homeBtn.classList.add('active-nav');
    }, 200);
  }
  
  currentTab = document.getElementById('home');
});
