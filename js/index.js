// siteName;
// siteUrl

var siteNameInput = document.getElementById("siteName");
var siteUrlInput = document.getElementById("siteUrl");
var bookmarkTbody = document.getElementById("tbodyContent");

var bookmarkContainers = [];
if (localStorage.getItem("bookmarks") != null) {
  bookmarkContainers = JSON.parse(localStorage.getItem("bookmarks"));
  displayBookmark();
}

//Add function
function addBookmark() {
  if (allValidateInput()) {
    var site = {
      siteName: capitalize(siteNameInput.value),
      siteUrl: siteUrlInput.value,
    };
    bookmarkContainers.push(site);
    // console.log(bookmarkContainers);
    displayBookmark();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers));
  } else {
    Swal.fire({
      icon: "error",
      title: "Site Name or Url is not valid, Please follow the rules below :",
      text: `Site name must contain at least 3 characters
      
      
      &Site URL must be a valid one   EX: https://www.example.com`,
    });
  }
}

//display funciton
function displayBookmark() {
  var cartona = "";
  for (var i = 0; i < bookmarkContainers.length; i++) {
    cartona += `
    <tr>
    <td>${i + 1}</td>
    <td>${bookmarkContainers[i].siteName}</td>
    <td>
    <a class="btn btn-danger" href="https://www.${
      bookmarkContainers[i].siteUrl
    }">
    <i class="fa-solid fa-eye pe-2"></i> Visit</a></td>
    <td>
    <button onclick='deleteBookmark(${i})'  class="btn btn-warning">
    <i class="fa-solid fa-trash-can"></i> Delete
    </button>
    </td>
    
    </tr>
    
    `;
  }
  // console.log(cartona);
  clear();
  bookmarkTbody.innerHTML = cartona;
}
function clear() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
}

function deleteBookmark(index) {
  bookmarkContainers.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers));
  displayBookmark();
}

// ==================================Search ==========================

function search(inputValue) {
  // console.log(inputValue);
  var searchList = [];
  for (var i = 0; i < bookmarkContainers.length; i++) {
    if (
      bookmarkContainers[i].siteName
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    ) {
      var cartona = "";

      cartona += `
      <tr>
              <td>${i + 1}</td>
              <td>${bookmarkContainers[i].siteName.replace(
                inputValue,
                `<span class="text-primary">${inputValue}</span>`
              )}</td>
             <td>
    <a class="btn btn-danger" href="https://www.${
      bookmarkContainers[i].siteUrl
    }">
    <i class="fa-solid fa-eye pe-2"></i> Visit</a></td>
    <td>
              <td>
              <button onclick='deleteBookmark(${i})'  class="btn btn-warning">
             <i class="fa-solid fa-trash-can"></i> Delete
              </button>
              </td>
              
            </tr>
      
      `;
    }
  }

  bookmarkTbody.innerHTML = cartona;
}

/=================================/;
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
    input.classList.replace("is-invalid", "is-valid");
    alert.classList.add("d-none");
    return true;
  } else {
    input.classList.add("is-invalid");
    alert.classList.remove("d-none");
    return false;
  }
}

function allValidateInput() {
  if (
    validate(/^\w{3,20}$/, siteNameInput.value, nameAlert, siteNameInput) &&
    validate(
      /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/,
      siteUrlInput.value,
      urlAlert,
      siteUrlInput
    )
  ) {
    return true;
  } else {
    return false;
  }
}
function capitalize(str) {
  let strArr = str.split("");
  strArr[0] = strArr[0].toUpperCase();
  return strArr.join("");
}

function visitWebsite(e) {
  var websiteIndex = e.target.dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(bookmarks[websiteIndex].siteURL)) {
    open(bookmarks[websiteIndex].siteURL);
  } else {
    open(`https://${bookmarks[websiteIndex].siteURL}`);
  }
}
