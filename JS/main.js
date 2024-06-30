let page = 1;

function getPostRequest() {
  document.querySelector(".loading").style.display = "flex";
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=20&page=${page++}`)
    .then((response) => {
      showPosts(response.data.data);
    })
    .catch((error) => alert(error.response.data.message));
}
function registerRequest(name, userName, password, email, image) {
  let formData = new FormData();
  formData.append("username", userName);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("image", image);
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((Response) => {
      localStorage.setItem("token", Response.data.token);
      localStorage.setItem("user", JSON.stringify(Response.data.user));
      afterlogin();
      showNotifications("Register Success");
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
function loginRequest(username, password) {
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: username,
      password: password,
    })
    .then((Response) => {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);
      localStorage.setItem("token", Response.data.token);
      localStorage.setItem("user", JSON.stringify(Response.data.user));
      afterlogin();
      showNotifications("Login Success");
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
function createPostRequest(title, body, image) {
  let token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (image != undefined) formData.append("image", image);
  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      showNotifications("Post Created Successfuly");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
function showPosts(posts) {
  let postsContainer = document.querySelector(".posts");
  for (let post of posts) {
    let userId = post.author.id;
    let postId = post.id;
    let userName = post.author.username;
    let email = post.author.email;
    let profileImage = post.author.profile_image;
    let time = post.created_at;
    let postImage = post.image;
    let title = "";
    if (post.title != null && post.title != "null") title = post.title;
    let body = post.body;
    let comment = post.comments_count;
    let postItem = `
      <div class="post">
        <div class="header">
          <img src="${profileImage}" data-id=${userId} alt="" />
          <h4 data-id=${userId}>${userName}</h4>
          <span class="time">${time}</span>
          <div class="update">✎</div>
          <div class="delete">✖</div>
        </div>
        <div class="body">
          <img src="${postImage}" alt="" />
          <h3 class="title">${title}</h3>
          <p>
            ${body}
          </p>
          <hr />
            <div class="comments" id="${postId}">
              <span>(${comment}) Comments</span>
              <div class="faild">
              <button class="btn" data-id=${postId}>Send</button>
              <input type="text" placeholder="Type a Comment" />
              </div>
            </div>
        </div>
      </div>`;
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (post.author.username == user.username) {
        document.querySelector("input[type='hidden']").value = userId;
        let postItem2 = `
        <div class="post mine">
        <div class="header">
          <img src="${profileImage}" data-id=${userId}  alt="" />
          <h4 data-id=${userId}>${userName}</h4>
          <span class="time">${time}</span>
          <div class="update" data-edit="${postId}">✎</div>
          <div class="delete" data-edit="${postId}">✖</div>
        </div>
        <div class="body">
          <img src="${postImage}" alt="" />
          <h3 class="title">${title}</h3>
          <p>
            ${body}
          </p>
          <hr />
            <div class="comments" id="${postId}">
              <span>(${comment}) Comments</span>
              <div class="faild">
              <button class="btn" data-id=${postId}>Send</button>
              <input type="text" placeholder="Type a Comment" />
              </div>
            </div>
        </div>
        </div>`;
        postsContainer.innerHTML += postItem2;
        continue;
      }
    }
    postsContainer.innerHTML += postItem;
  }
  document.querySelector(".loading").style.display = "none";
}
function afterlogin() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.querySelector(".btns img").src = user.profile_image;
    document.querySelector(".btns img").dataset.id = user.id;
    document.querySelector(".btns .userName").dataset.id = user.id;
    document.querySelector(".btns .userName").innerHTML = user.username;
  }
  document.querySelector(".btns .login").classList.add("hide");
  document.querySelector(".btns .register").classList.add("hide");
  document.querySelector(".btns .logout").classList.add("show");
  document.querySelector(".btns .userName").classList.add("show");
  document.querySelector(".addPostBtn").classList.add("show");
  document.querySelector(".profileIcon").classList.add("show");
}
function afterlogout() {
  document.querySelector(".btns .login").classList.remove("hide");
  document.querySelector(".btns .register").classList.remove("hide");
  document.querySelector(".btns .logout").classList.remove("show");
  document.querySelector(".btns .userName").classList.remove("show");
  document.querySelector(".addPostBtn").classList.remove("show");
  document.querySelector(".profileIcon").classList.remove("show");
}
function modalLogin() {
  let loginBtn = document.querySelector(".btns .login");
  loginBtn.addEventListener("click", () => {
    document.querySelector(".overlay").classList.add("active");
    document.querySelector(".modal.login").classList.add("show");
  });
  let cancel = document.querySelector(".modal.login .cancel");
  cancel.addEventListener("click", () => {
    document.querySelector(".overlay").classList.remove("active");
    document.querySelector(".modal.login").classList.remove("show");
  });
  let login = document.querySelector(".modal.login .login");
  login.addEventListener("click", () => {
    let userName = document.querySelector(
      ".modal.login input[type='text']"
    ).value;
    let password = document.querySelector(
      ".modal.login input[type='password']"
    ).value;
    if (userName != "" && password != "") {
      loginRequest(userName, password);
      cancel.click();
    } else {
      alert("please fill all the feild");
    }
  });
}
function modalRegister() {
  let registerBtn = document.querySelector(".btns .register");
  registerBtn.addEventListener("click", () => {
    document.querySelector(".overlay").classList.add("active");
    document.querySelector(".modal.register").classList.add("show");
  });
  let cancel = document.querySelector(".modal.register .cancel");
  cancel.addEventListener("click", () => {
    document.querySelector(".overlay").classList.remove("active");
    document.querySelector(".modal.register").classList.remove("show");
  });
  let register = document.querySelector(".modal.register .register");
  register.addEventListener("click", () => {
    let name = document.querySelector(".modal.register .name");
    let userName = document.querySelector(".modal.register .userName");
    let password = document.querySelector(".modal.register .password");
    let email = document.querySelector(".modal.register .email");
    let image = document.querySelector(".modal.register .image");
    if (
      name.value != "" &&
      userName.value != "" &&
      password.value != "" &&
      email.value != "" &&
      image.value != ""
    ) {
      registerRequest(
        name.value,
        userName.value,
        password.value,
        email.value,
        image.files[0]
      );
      cancel.click();
    } else {
      alert("please fill all the feild");
    }
  });
}
function logoutBtn() {
  document.querySelector(".logout").addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    afterlogout();
    showNotifications("Logout Success");
  });
}
function addPostBtn() {
  document.querySelector(".addPostBtn").addEventListener("click", () => {
    document.querySelector(".overlay").classList.add("active");
    document.querySelector(".modal.addPost").classList.add("show");
  });
  let cancel = document.querySelector(".modal.addPost .cancel");
  cancel.addEventListener("click", () => {
    document.querySelector(".overlay").classList.remove("active");
    document.querySelector(".modal.addPost").classList.remove("show");
  });
  let add = document.querySelector(".addPost .add");
  add.addEventListener("click", () => {
    let title = document.querySelector(".addPost .title");
    let body = document.querySelector(".addPost .body");
    let img = document.querySelector(".addPost input[type='file']");
    if (body.value != "") {
      document.querySelector(".loading").style.display = "flex";
      createPostRequest(title.value, body.value, img.files[0]);
      cancel.click();
    } else {
      alert("please fill the body feild at least");
    }
  });
}
function showNotifications(message) {
  let notification = document.createElement("div");
  notification.innerHTML = message;
  notification.setAttribute("id", message);
  document.querySelector(".notifications").appendChild(notification);
  setTimeout(() => {
    document.getElementById(message).classList.add("show");
  }, 500);
  setTimeout(() => {
    document.getElementById(message).classList.remove("show");
    setTimeout(() => {
      document.getElementById(message).remove();
    }, 500);
  }, 5000);
}
function handleScroll() {
  window.addEventListener("scroll", function handleScroll() {
    if (
      window.scrollY + window.innerHeight + 1 >=
      document.documentElement.scrollHeight
    ) {
      getPostRequest();
    }
    if (this.window.scrollY >= this.window.innerHeight) {
      document.querySelector(".up").style.display = "flex";
    } else {
      document.querySelector(".up").style.display = "none";
    }
  });
  document.querySelector(".up").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
function showComment(id, target) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
      if (response.data.data.comments_count > 0) {
        let comments = response.data.data.comments;
        let commentContainer = document.createElement("div");
        commentContainer.classList.add("commentContainer");
        comments.forEach((comment) => {
          let div = document.createElement("div");
          div.classList.add("comment");
          let user = document.createElement("span");
          user.classList.add("user");
          user.appendChild(document.createTextNode(comment.author.username));
          let body = document.createElement("span");
          body.classList.add("body");
          body.appendChild(document.createTextNode(comment.body));
          div.appendChild(user);
          div.appendChild(body);
          commentContainer.appendChild(div);
        });
        target.appendChild(commentContainer);
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
function handelComments() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("comments")) {
      if (e.target.classList.contains("show")) {
        e.target.classList.remove("show");
        try {
          document.querySelector(".commentContainer").remove();
        } catch {}
      } else {
        e.target.classList.add("show");
        let id = e.target.id;
        showComment(id, e.target);
      }
    }
  });
}
function addComment() {
  let token = localStorage.getItem("token");
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      let id = e.target.dataset.id;
      if (e.target.nextElementSibling) {
        if (e.target.nextElementSibling.value != "") {
          value = e.target.nextElementSibling.value;
          axios
            .post(
              `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
              {
                body: value,
              },
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              showNotifications("Comment Added Successfuly");
              window.location.reload();
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        } else {
          alert("please type something");
        }
        e.target.nextElementSibling.value = "";
      }
    }
  });
}
function updatePostRequest(title, body, image, id) {
  let token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("_method", "put");
  if (image != undefined) formData.append("image", image);
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      showNotifications("Post Updated Successfuly");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
function updatePost() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update")) {
      let id = e.target.dataset.edit;
      document.querySelector(".overlay").classList.add("active");
      document.querySelector(".modal.updatePost").classList.add("show");
      let cancel = document.querySelector(".modal.updatePost .cancel");
      cancel.addEventListener("click", () => {
        document.querySelector(".overlay").classList.remove("active");
        document.querySelector(".modal.updatePost").classList.remove("show");
      });
      let update = document.querySelector(".updatePost .update");
      update.addEventListener("click", () => {
        let title = document.querySelector(".updatePost .title");
        let body = document.querySelector(".updatePost .body");
        let img = document.querySelector(".updatePost input[type='file']");
        if (body.value != "") {
          document.querySelector(".loading").style.display = "flex";
          updatePostRequest(title.value, body.value, img.files[0], id);
          cancel.click();
        } else {
          alert("please fill the body feild at least");
        }
      });
    }
  });
}
function deletePostRequest(id) {
  let token = localStorage.getItem("token");
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      showNotifications("Post Deleted Successfuly");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}
function deletePost() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      let id = e.target.dataset.edit;
      deletePostRequest(id);
    }
  });
}
function sessionLogin() {
  let myUserName = sessionStorage.getItem("username");
  let myPassword = sessionStorage.getItem("password");
  if (myUserName != null && myPassword != null) {
    loginRequest(myUserName, myPassword);
  }
}

function switchPages() {
  let pages = document.querySelectorAll("header .pages li");
  pages.forEach((page) => {
    page.onclick = () => {
      if (page.classList.contains("profile")) {
        let adminId = JSON.parse(localStorage.getItem("user"));
        if (adminId) sessionStorage.setItem("targetUserId", adminId.id);
      }
      window.location.href = `${page.id}.html`;
    };
  });
  document.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    if (id) {
      axios
        .get(`https://tarmeezacademy.com/api/v1/users/${id}`)
        .then((response) => {
          sessionStorage.setItem("targetUserId", response.data.data.id);
          location.href = "./profile.html";
        });
      // .catch((error) => alert(error.response.data.message));
    }
  });
}

sessionLogin();
getPostRequest();
modalLogin();
modalRegister();
logoutBtn();
addPostBtn();
handleScroll();
handelComments();
addComment();
updatePost();
deletePost();
switchPages();
