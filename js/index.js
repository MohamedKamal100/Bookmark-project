// siteName;
// siteUrl

var siteNameInput = document.getElementById("siteName")
var siteUrlInput = document.getElementById("siteUrl")
var bookmarkTbody = document.getElementById("tbodyContent")
var nameAlert = document.getElementById("nameAlert")
var urlAlert = document.getElementById("urlAlert")
var Swal = window.Swal // Assuming Swal is available globally, e.g., from a CDN

var bookmarkContainers = []
var bookmarkLimit = "all" // Default to show all bookmarks

if (localStorage.getItem("bookmarks") != null) {
  bookmarkContainers = JSON.parse(localStorage.getItem("bookmarks"))
  displayBookmark()
}

// Typewriter effect for the title
function typewriterEffect() {
  const title = document.getElementById("typewriter-title")
  const text = title.textContent
  title.textContent = ""
  title.style.opacity = "1"

  // Split text into characters and create spans
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span")
    span.className = "char"
    span.textContent = text[i]
    title.appendChild(span)
  }

  // Animate each character
  const chars = document.querySelectorAll(".char")
  chars.forEach((char, index) => {
    setTimeout(() => {
      char.classList.add("visible")
    }, 100 * index)
  })
}

// Update bookmark limit
function updateBookmarkLimit(limit) {
  bookmarkLimit = limit
  displayBookmark()
}

//Add function
function addBookmark() {
  if (allValidateInput()) {
    var site = {
      siteName: capitalize(siteNameInput.value),
      siteUrl: siteUrlInput.value,
    }

    // Add success animation
    const submitBtn = document.getElementById("submitBtn")
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
    })
  }
}

//display funciton
function displayBookmark() {
  var cartona = ""

  // Determine how many bookmarks to display
  let displayCount = bookmarkContainers.length
  if (bookmarkLimit !== "all") {
    displayCount = Math.min(Number.parseInt(bookmarkLimit), bookmarkContainers.length)
  }

  for (var i = 0; i < displayCount; i++) {
    cartona += `
    <tr class="animate__animated animate__fadeIn" style="animation-delay: ${i * 0.1}s">
    <td>${i + 1}</td>
    <td>${bookmarkContainers[i].siteName}</td>
    <td>
    <a target="_blank" class="btn btn-danger" href="https://www.${bookmarkContainers[i].siteUrl}">
    <i class="fa-solid fa-eye pe-2"></i> Visit</a></td>
    <td>
    <button onclick='deleteBookmark(${i})'  class="btn btn-warning">
    <i class="fa-solid fa-trash-can"></i> Delete
    </button>
    </td>
    
    </tr>
    
    `
  }

  // Add a message if there are more bookmarks than shown
  if (bookmarkLimit !== "all" && bookmarkContainers.length > displayCount) {
    const remaining = bookmarkContainers.length - displayCount
    cartona += `
    <tr>
      <td colspan="4" class="text-center text-muted">
        <em>Showing ${displayCount} of ${bookmarkContainers.length} bookmarks. ${remaining} more hidden.</em>
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

  const matchedBookmarks = bookmarkContainers.filter((bookmark) =>
    bookmark.siteName.toLowerCase().includes(inputValue.toLowerCase()),
  )

  // Apply bookmark limit to search results if needed
  let displayCount = matchedBookmarks.length
  if (bookmarkLimit !== "all") {
    displayCount = Math.min(Number.parseInt(bookmarkLimit), matchedBookmarks.length)
  }

  for (var i = 0; i < displayCount; i++) {
    const bookmark = matchedBookmarks[i]
    const originalIndex = bookmarkContainers.indexOf(bookmark)

    cartona += `
    <tr class="animate__animated animate__fadeIn">
      <td>${originalIndex + 1}</td>
      <td>${bookmark.siteName.replace(
      new RegExp(inputValue, "gi"),
      `<span class="text-primary animate__animated animate__flash animate__delay-1s">${inputValue}</span>`,
    )}</td>
      <td>
        <a target="_blank" class="btn btn-danger" href="https://www.${bookmark.siteUrl}">
          <i class="fa-solid fa-eye pe-2"></i> Visit
        </a>
      </td>
      <td>
        <button onclick='deleteBookmark(${originalIndex})' class="btn btn-warning">
          <i class="fa-solid fa-trash-can"></i> Delete
        </button>
      </td>
    </tr>
    `
  }

  // Add a message if there are more search results than shown
  if (bookmarkLimit !== "all" && matchedBookmarks.length > displayCount) {
    const remaining = matchedBookmarks.length - displayCount
    cartona += `
    <tr>
      <td colspan="4" class="text-center text-muted">
        <em>Showing ${displayCount} of ${matchedBookmarks.length} matching bookmarks. ${remaining} more hidden.</em>
      </td>
    </tr>
    `
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

// Initialize animations
document.addEventListener("DOMContentLoaded", () => {
  // Start typewriter effect
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
})
