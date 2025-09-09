const form = document.getElementById("infoForm");
const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const avatarError = document.querySelector(".avatar-error");
const emailInput = document.getElementById("email");

const emailError = document.querySelector(".email-error");

// Upload box triggers input
uploadBox.addEventListener("click", () => fileInput.click());

// Drag & drop
uploadBox.addEventListener("dragover", (e) => e.preventDefault());
uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) validateAndPreviewFile(file);
});

// File selection
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) validateAndPreviewFile(file);
});

function validateAndPreviewFile(file) {
  if (!file.type.startsWith("image/") || file.size > 500 * 1024) {
    uploadBox.classList.add("error");
    avatarError.classList.add("active");
    previewImage.style.display = "none";
    return;
  }
  uploadBox.classList.remove("error");
  avatarError.classList.remove("active");

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
  };
  reader.readAsDataURL(file);
}

// Form validation
form.addEventListener("submit", (e) => {
  let valid = true;

  // Email validation
  if (!emailInput.validity.valid) {
    emailInput.parentElement.classList.add("error");
    emailError.classList.add("active");
    valid = false;
  } else {
    emailInput.parentElement.classList.remove("error");
    emailError.classList.remove("active");
  }

  // File validation (must exist & be valid)
  if (!fileInput.files[0] || fileInput.files[0].size > 500 * 1024) {
    uploadBox.classList.add("error");
    avatarError.classList.add("active");
    valid = false;
  }

  if (!valid) e.preventDefault();
});
