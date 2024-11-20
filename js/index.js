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
  var site = {
    siteName: siteNameInput.value,
    siteUrl: siteUrlInput.value,
  };
  bookmarkContainers.push(site);
  // console.log(bookmarkContainers);
  displayBookmark();
  clear();
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkContainers));
}

//display funciton
function displayBookmark() {
  var cartona = "";
  for (var i = 0; i < bookmarkContainers.length; i++) {
    cartona += `
    <tr>
            <td>${i + 1}</td>
            <td>${bookmarkContainers[i].siteName}</td>
            <td><a href="${
              bookmarkContainers[i].siteUrl
            }"><button class="btn btn-danger">Visit</button></a></td>
            <td>
            <button onclick='deleteBookmark(${i})'  class="btn btn-warning">
            Delete
            </button>
            </td>
            
          </tr>
    
    `;
  }
  // console.log(cartona);
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
              <td><a href="${
                bookmarkContainers[i].siteUrl
              }"><button class="btn btn-danger">Visit</button></a></td>
              <td>
              <button onclick='deleteBookmark(${i})'  class="btn btn-warning">
              Delete
              </button>
              </td>
              
            </tr>
      
      `;
    }
  }

  bookmarkTbody.innerHTML = cartona;
}
