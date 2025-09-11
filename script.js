const uploadBox = document.querySelector('#uploadBox');
const fileInput = document.querySelector('#chooseAvatar');
const previewImage = document.getElementById('previewImage');
const avatarError = document.querySelector('.avatar-error');
const emailInput = document.getElementById('email');
const emailError = document.querySelector('.email-error');
const form = document.getElementById('infoForm');
const uploadInstructions = document.querySelector('.upload-instructions');
const imageDisplay = document.querySelector('.image-display');
const uploadInfo = document.querySelector('.upload-info');
const removeImageBtn = document.querySelector('.js-removeImage');
const changeImageBtn = document.querySelector('.js-changeImage');



function showError() {
  uploadBox.classList.add('error');
  avatarError.classList.add('active');
  previewImage.style.display = 'none';
}

function clearError() {
  uploadBox.classList.remove('error');
  avatarError.classList.remove('active');
}


function showPreview() {
  uploadInstructions.style.display = 'none';
  imageDisplay.style.display = 'block';
  uploadInfo.style.display = 'block';
}

function hidePreview() {
  previewImage.src = '';
  previewImage.style.display = 'none';
  imageDisplay.style.display = 'none';
  uploadInstructions.style.display = 'block';
  uploadBox.classList.remove('error');
  avatarError.classList.remove('active');
  uploadInfo.style.display = 'block';
}

function validateFile(file) {
  return file.type.startsWith('image/') && file.size <= 500 * 1024;
}

function validateAndPreviewFile(file) {
  if (!validateFile(file)) {
    showError();
    hidePreview();
    return;
  }

  clearError();
  showPreview();
  uploadBox.removeEventListener('click', handleUploadBoxClick);

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function handleUploadBoxClick() {
  fileInput.click();
}

function resetFileInput() {
  fileInput.value = '';
}

uploadBox.addEventListener('click', handleUploadBoxClick);

// Drag & drop support
uploadBox.addEventListener('dragover', (e) => e.preventDefault());

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) validateAndPreviewFile(file);
});


fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) validateAndPreviewFile(file);
});



removeImageBtn.addEventListener('click', () => {
  resetFileInput();
  hidePreview();
  clearError();
  uploadBox.addEventListener('click', handleUploadBoxClick);
});

changeImageBtn.addEventListener('click', () => {
  handleUploadBoxClick();
});


// Form validation on submit
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page refresh

  let valid = true;

  // Validate email
  if (!emailInput.validity.valid) {
    emailInput.parentElement.classList.add('error');
    emailError.classList.add('active');
    valid = false;
  } else {
    emailInput.parentElement.classList.remove('error');
    emailError.classList.remove('active');
  }

  // Validate file
  const file = fileInput.files[0];
  if (!file || !validateFile(file)) {
    uploadInfo.style.display = 'none';
    showError();
    valid = false;
  }

  if (!valid) return;

  // ✅ Get form data
  const name = document.getElementById('name').value;
  const email = emailInput.value;
  const username = document.getElementById('username').value;

  // ✅ Pass to ticket generator
  generateTicket({ name, email, username, avatar: previewImage.src });
});


function generateTicketId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const groupLength = 4;
  const numGroups = 3;
  let id = [];

  for (let g = 0; g < numGroups; g++) {
    let group = '';
    for (let i = 0; i < groupLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      group += chars[randomIndex];
    }
    id.push(group);
  }

  return id.join('-');
}

// Ticket generation function (unchanged, can be moved to separate module)
function generateTicket({ name, email, username, avatar }) {
  ticketId = generateTicketId();
  const ticketHTML = `
    <h1 class="heading">Congrats,<span class="ticket-header-name">${name}!</span><br> Your ticket is ready.</h1>
    <p class="subtext ticket-header-subtext">We've emailed your ticket to<br> <span class="colored-email">${email}</span> and will send you updates in the run up to the event.</p>
    <div class="ticket">
      <div class="ticket-top">
        <img src="/assets/images/logo-full.svg" alt="logo" class="ticket-logo" />
        <p class="ticket-event-date-location">Jan 31, 2025 / Austin, TX</p>
      </div>
      <div class="ticket-right">
        <p class="ticket-id">${ticketId}</p>
      </div>
      <div class="ticket-bottom">
        <img class="preview-img" src="${avatar}" alt="ticket owner image" />
        <div class="ticket-owner-info">
          <p>${name}</p>
          <div class="git-info">
            <img src="./assets/images/icon-github.svg" alt="github icon" />
            <p class="git-username">@${username}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('main').innerHTML = ticketHTML;
  document.getElementById('css').href = 'ticket.css';
}
