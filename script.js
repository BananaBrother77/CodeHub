function changeSection() {
  const tabBtns = document.querySelectorAll('.card');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const allTabs = document.querySelectorAll('.tab');
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      
      if (target) {
        allTabs.forEach(tab => tab.classList.remove('is-active'));
        target.classList.add('is-active');
        void target.offsetWidth;
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
    alert('success');
  } else {
    alert('error');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  changeSection();
  showAddCodeMenu();
});