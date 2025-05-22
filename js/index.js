// siteName;
// siteUrl

var siteNameInput = document.getElementById("siteName")
var siteUrlInput = document.getElementById("siteUrl")
var bookmarkTbody = document.getElementById("tbodyContent")
var nameAlert = document.getElementById("nameAlert")
var urlAlert = document.getElementById("urlAlert")
var submitBtn = document.getElementById("submitBtn")
var updateBtn = document.getElementById("updateBtn")
var cancelBtn = document.getElementById("cancelBtn")
var themeToggle = document.getElementById("themeToggle")
var Swal = window.Swal // Assuming Swal is available globally, e.g., from a CDN

var bookmarkContainers = []
var currentEditIndex = -1 // Track which bookmark is being edited

// Load bookmarks from localStorage
if (localStorage.getItem("bookmarks") != null) {
  bookmarkContainers = JSON.parse(localStorage.getItem("bookmarks"))
  displayBookmark()
}

// Load theme preference from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode")
    document.documentElement.classList.remove("light-mode")
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>'
  } else {
    document.documentElement.classList.add("light-mode")
    document.documentElement.classList.remove("dark-mode")
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>'
  }
}

// Toggle theme
function toggleTheme() {
  if (document.documentElement.classList.contains("light-mode")) {
    document.documentElement.classList.remove("light-mode")
    document.documentElement.classList.add("dark-mode")
    localStorage.setItem("theme", "dark")
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>'

    // Add animation to theme change
    document.body.classList.add("animate__animated", "animate__fadeIn")
    setTimeout(() => {
      document.body.classList.remove("animate__animated", "animate__fadeIn")
    }, 1000)

    // Restart typewriter effect
    typewriterEffect()
  } else {
    document.documentElement.classList.remove("dark-mode")
    document.documentElement.classList.add("light-mode")
    localStorage.setItem("theme", "light")
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>'

    // Add animation to theme change
    document.body.classList.add("animate__animated", "animate__fadeIn")
    setTimeout(() => {
      document.body.classList.remove("animate__animated", "animate__fadeIn")
    }, 1000)

    // Restart typewriter effect
    typewriterEffect()
  }
}

// Add bookmark function
function addBookmark() {
  if (allValidateInput()) {
    var site = {
      siteName: capitalize(siteNameInput.value),
      siteUrl: siteUrlInput.value,
    }

    // Add success animation
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added!'
    submitBtn.classList.add("animate__animated", "animate__rubberBand")

    // Clear inputs immediately
    clear()

    // Add bookmark to array and update localStorage
    bookmarkContainers.push(site)
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers))

    // Display updated bookmarks
    displayBookmark()

    // Reset button after a short delay
    setTimeout(() => {
      submitBtn.innerHTML = "Submit"
      submitBtn.classList.remove("animate__animated", "animate__rubberBand")
    }, 1000)
  } else {
    Swal.fire({
      icon: "error",
      title: "Site Name or Url is not valid, Please follow the rules below :",
      text: `Site name must contain at least 3 characters
      
      
      &Site URL must be a valid one   EX: https://www.example.com`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      background: document.documentElement.classList.contains("dark-mode") ? "#1a1a2e" : "#fff",
      color: document.documentElement.classList.contains("dark-mode") ? "#f0f0f0" : "#333",
    })
  }
}

// Edit bookmark function
function editBookmark(index) {
  // Store the current edit index
  currentEditIndex = index

  // Populate form with bookmark data
  siteNameInput.value = bookmarkContainers[index].siteName
  siteUrlInput.value = bookmarkContainers[index].siteUrl

  // Validate inputs to show valid state
  validate(/^\w{3,20}$/, siteNameInput.value, nameAlert, siteNameInput)
  validate(/^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/, siteUrlInput.value, urlAlert, siteUrlInput)

  // Hide submit button, show update and cancel buttons
  submitBtn.classList.add("d-none")
  updateBtn.classList.remove("d-none")
  cancelBtn.classList.remove("d-none")

  // Scroll to form
  document.querySelector(".content").scrollIntoView({ behavior: "smooth" })

  // Highlight the row being edited
  const rows = document.querySelectorAll("#tbodyContent tr")
  rows.forEach((row, i) => {
    if (i === index) {
      row.classList.add("editing-row")
    } else {
      row.classList.remove("editing-row")
    }
  })

  // Add animation to form
  siteNameInput.classList.add("animate__animated", "animate__pulse")
  siteUrlInput.classList.add("animate__animated", "animate__pulse")
  setTimeout(() => {
    siteNameInput.classList.remove("animate__animated", "animate__pulse")
    siteUrlInput.classList.remove("animate__animated", "animate__pulse")
  }, 1000)
}

// Update bookmark function
function updateBookmark() {
  if (currentEditIndex === -1) return

  if (allValidateInput()) {
    // Update the bookmark
    bookmarkContainers[currentEditIndex] = {
      siteName: capitalize(siteNameInput.value),
      siteUrl: siteUrlInput.value,
    }

    // Save to localStorage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers))

    // Show success animation
    updateBtn.innerHTML = '<i class="fa-solid fa-check"></i> Updated!'
    updateBtn.classList.add("animate__animated", "animate__rubberBand")

    // Clear form and reset UI
    setTimeout(() => {
      clear()
      updateBtn.innerHTML = "Update Bookmark"
      updateBtn.classList.remove("animate__animated", "animate__rubberBand")
      updateBtn.classList.add("d-none")
      cancelBtn.classList.add("d-none")
      submitBtn.classList.remove("d-none")
      currentEditIndex = -1

      // Display updated bookmarks
      displayBookmark()

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Bookmark Updated!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        background: document.documentElement.classList.contains("dark-mode") ? "#1a1a2e" : "#fff",
        color: document.documentElement.classList.contains("dark-mode") ? "#f0f0f0" : "#333",
      })
    }, 1000)
  } else {
    Swal.fire({
      icon: "error",
      title: "Site Name or Url is not valid, Please follow the rules below :",
      text: `Site name must contain at least 3 characters
      
      
      &Site URL must be a valid one   EX: https://www.example.com`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      background: document.documentElement.classList.contains("dark-mode") ? "#1a1a2e" : "#fff",
      color: document.documentElement.classList.contains("dark-mode") ? "#f0f0f0" : "#333",
    })
  }
}

// Cancel edit function
function cancelEdit() {
  clear()
  updateBtn.classList.add("d-none")
  cancelBtn.classList.add("d-none")
  submitBtn.classList.remove("d-none")
  currentEditIndex = -1

  // Remove highlight from all rows
  const rows = document.querySelectorAll("#tbodyContent tr")
  rows.forEach((row) => row.classList.remove("editing-row"))

  displayBookmark()
}

//display funciton
function displayBookmark() {
  var cartona = ""
  for (var i = 0; i < bookmarkContainers.length; i++) {
    const isEditing = i === currentEditIndex
    cartona += `
    <tr class="animate__animated animate__fadeIn ${isEditing ? "editing-row" : ""}" style="animation-delay: ${i * 0.1}s">
    <td>${i + 1}</td>
    <td>${bookmarkContainers[i].siteName}</td>
    <td>
    <a target="_blank" class="btn btn-danger" href="https://www.${bookmarkContainers[i].siteUrl}">
    <i class="fa-solid fa-eye pe-2"></i> Visit</a></td>
    <td>
    <button onclick='editBookmark(${i})' class="btn btn-info">
    <i class="fa-solid fa-edit"></i> Edit
    </button>
    </td>
    <td>
    <button onclick='deleteBookmark(${i})' class="btn btn-warning">
    <i class="fa-solid fa-trash-can"></i> Delete
    </button>
    </td>
    
    </tr>
    
    `
  }
  bookmarkTbody.innerHTML = cartona
}

// Clear input fields
function clear() {
  siteNameInput.value = ""
  siteUrlInput.value = ""

  // Also reset validation classes
  siteNameInput.classList.remove("is-valid", "is-invalid")
  siteUrlInput.classList.remove("is-valid", "is-invalid")
}

function deleteBookmark(index) {
  // If deleting the bookmark being edited, reset the edit state
  if (index === currentEditIndex) {
    cancelEdit()
  }

  // Add animation before removing
  const rows = document.querySelectorAll("#tbodyContent tr")
  if (rows[index]) {
    rows[index].classList.add("animate__animated", "animate__fadeOutRight")

    // Wait for animation to complete before removing
    setTimeout(() => {
      bookmarkContainers.splice(index, 1)
      localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers))
      displayBookmark()
    }, 500)
  } else {
    bookmarkContainers.splice(index, 1)
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers))
    displayBookmark()
  }
}

// ==================================Search ==========================

function search(inputValue) {
  var cartona = ""

  if (inputValue.trim() === "") {
    displayBookmark()
    return
  }

  for (var i = 0; i < bookmarkContainers.length; i++) {
    if (bookmarkContainers[i].siteName.toLowerCase().includes(inputValue.toLowerCase())) {
      const isEditing = i === currentEditIndex
      cartona += `
      <tr class="animate__animated animate__fadeIn ${isEditing ? "editing-row" : ""}">
              <td>${i + 1}</td>
              <td>${bookmarkContainers[i].siteName.replace(
        new RegExp(inputValue, "gi"),
        `<span class="text-primary animate__animated animate__flash animate__delay-1s">${inputValue}</span>`,
      )}</td>
             <td>
    <a target="_blank" class="btn btn-danger" href="https://www.${bookmarkContainers[i].siteUrl}">
    <i class="fa-solid fa-eye pe-2"></i> Visit</a></td>
              <td>
              <button onclick='editBookmark(${i})' class="btn btn-info">
              <i class="fa-solid fa-edit"></i> Edit
              </button>
              </td>
              <td>
              <button onclick='deleteBookmark(${i})' class="btn btn-warning">
             <i class="fa-solid fa-trash-can"></i> Delete
              </button>
              </td>
            </tr>
      `
    }
  }

  bookmarkTbody.innerHTML = cartona
}
; /=================================/
// var nameRegex = /^\w{3,20}$/;
// var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;
// function validateBookmarkName(nameValue) {
//   if (nameRegex.test(nameValue)) {
//     siteNameInput.classList.replace("is-invalid", "is-valid");
//     nameAlert.classList.add("d-none");
//   } else {
//     siteNameInput.classList.add("is-invalid");
//     nameAlert.classList.remove("d-none");
//   }
// }
// function validateBookmarkUrl(urlValue) {
//   if (urlRegex.test(urlValue)) {
//     siteUrlInput.classList.replace("is-invalid", "is-valid");
//     urlAlert.classList.add("d-none");
//   } else {
//     siteUrlInput.classList.add("is-invalid");
//     urlAlert.classList.remove("d-none");
//   }
// }

//  Validate Function in Global for each input

function validate(regex, inputValue, alert, input) {
  if (regex.test(inputValue)) {
    input.classList.replace("is-invalid", "is-valid")
    alert.classList.add("d-none")

    // Add subtle animation for valid input
    input.classList.add("animate__animated", "animate__pulse")
    setTimeout(() => {
      input.classList.remove("animate__animated", "animate__pulse")
    }, 500)

    return true
  } else {
    input.classList.add("is-invalid")
    alert.classList.remove("d-none")

    // Add gentler shake animation for invalid input
    if (inputValue !== "") {
      input.classList.add("gentle-shake")
      setTimeout(() => {
        input.classList.remove("gentle-shake")
      }, 500)
    }

    return false
  }
}

function allValidateInput() {
  if (
    validate(/^\w{3,20}$/, siteNameInput.value, nameAlert, siteNameInput) &&
    validate(/^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/, siteUrlInput.value, urlAlert, siteUrlInput)
  ) {
    return true
  } else {
    return false
  }
}
function capitalize(str) {
  const strArr = str.split("")
  strArr[0] = strArr[0].toUpperCase()
  return strArr.join("")
}

// Initialize animations and theme
document.addEventListener("DOMContentLoaded", () => {
  // Load theme preference
  loadTheme()

  // Theme toggle event listener
  themeToggle.addEventListener("click", toggleTheme)

  // Start typewriter effect for subtitle
  typewriterEffect()

  // Add hover effects to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)"
      this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
      this.style.boxShadow = "none"
    })
  })

  // Animate header icons
  const headerIcons = document.querySelectorAll("h2 i")
  headerIcons.forEach((icon) => {
    setInterval(() => {
      icon.classList.add("animate__animated", "animate__heartBeat")
      setTimeout(() => {
        icon.classList.remove("animate__animated", "animate__heartBeat")
      }, 1000)
    }, 5000)
  })

  // Add keyboard shortcut for cancel (Escape key)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && currentEditIndex !== -1) {
      cancelEdit()
    }
  })
})
