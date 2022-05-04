const loginStatus = document.querySelector("#loginStatus")

const registerEmailInput = document.querySelector("#emailInputRegister");
const registerButton = document.querySelector("#registerButton");

const loginEmailInput = document.querySelector("#emailInputLogin");
const loginButton = document.querySelector("#loginButton");

const logoutButton = document.querySelector("#logoutButton")

const uploadFile = document.querySelector("#uploadFile");
const uploadFileID = document.querySelector("#fileID");
const uploadButton = document.querySelector("#uploadFileButton");
const uploadStatus = document.querySelector("#uploadStatus")

const viewFileIDInput = document.querySelector("#fileIDInput");
const viewFileInfo = document.querySelector("#viewFileInfo")
const viewFileID = document.querySelector("#viewFileID")
const viewFileOwner = document.querySelector("#viewFileOwner")
const viewFileName = document.querySelector("#viewFileName")
const viewButton = document.querySelector("#viewFileButton");
const viewVersions = document.querySelector("#viewVersions")

const listButton = document.querySelector("#listFileButton");
const listFileInfo = document.querySelector("#listFileInfo");
const listFiles = document.querySelector("#listFiles");



window.onload = () => {
  if (localStorage.email && localStorage.email !== "") {
    loginStatus.innerHTML = `login as ${localStorage.email}`
  } else {
    loginStatus.innerHTML = ""
  }
}


registerButton.addEventListener("click", function () {
  //send POST /register
  axios({
    method: "post",
    url: "/register",
    data: {
      email: registerEmailInput.value
    }
  })
    .then(res => {
      localStorage.setItem("token", res.data)
      localStorage.setItem("email", registerEmailInput.value)
      alert("Register successfully")
      window.location.reload()
    })
    .catch(err => alert(`Error: ${err.response.data}`))
});


loginButton.addEventListener("click", function () {
  //send POST /login
  axios({
    method: "post",
    url: "/login",
    data: {
      email: loginEmailInput.value
    }
  })
    .then(res => {
      localStorage.setItem("token", res.data)
      localStorage.setItem("email", loginEmailInput.value)
      alert("Login successfully")
      window.location.reload()
    })
    .catch(err => alert(`Error: ${err.response.data}`))
});


logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token")
  localStorage.removeItem("email")
  window.location.reload()
})


uploadButton.addEventListener("click", function () {
  //send POST /upload
  if (uploadFile.files.length == 0) {
    alert("Error: No file added")
  } else {
    let formData = new FormData()
    formData.append("file", uploadFile.files[0])
    formData.append("fileid", uploadFileID.value)
    uploadStatus.innerHTML = "Uploading ..."
    axios({
      method: "post",
      url: "/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "token": localStorage.getItem("token")
      }
    })
      .then(res => {
        alert(`Upload file successfully. File ID: ${res.data}`)
        window.location.reload()
      })
      .catch(err => alert(`Error: ${err.response.data}`))
  }
})


viewButton.addEventListener("click", function () {
  //send POST /view
  if (viewFileIDInput.value == "") {
    alert("File ID invalid")
  } else {
    axios({
      method: "get",
      url: `/view/${viewFileIDInput.value}`
    })
      .then(res => {
        viewFileInfo.style.display = "block"
        viewFileID.innerHTML = viewFileIDInput.value
        viewFileOwner.innerHTML = res.data.owner
        viewFileName.innerHTML = res.data.name
        let versions = res.data.versions
        viewVersions.innerHTML = ""
        for (var i = 0; i < versions.length; i++) {
          let download_url = `/download/${viewFileIDInput.value}/${i}`
          viewVersions.innerHTML += `
            <tr>
              <th scope="row">${i + 1}</th>
              <td><a href="${download_url}">${versions[i].hash}</a></td>
              <td>${versions[i].name}</td>
              <td>${versions[i].creationTime}</td>
            </tr>`
        }
      })
      .catch(err => alert(`Error: ${err.response.data}`))
  }
});


listButton.addEventListener("click", function () {
  // send GET /list
  axios({
    method: "get",
    url: "/list",
    headers: {
      "token": localStorage.getItem("token")
    }
  })
    .then(res => {
      listFileInfo.style.display = "block"
      let files = res.data
      listFiles.innerHTML = ""
      for (var i = 0; i < files.length; i++) {
        listFiles.innerHTML += `
          <tr>
            <th scope="row">${i + 1}</th>
            <td>${files[i]}</td>
          </tr>`
      }
    })
    .catch(err => alert(`Error: ${err.response.data}`))
})
