// // import cookieParser from "cookie-parser"

let createPost = document.querySelector("#createPost")

let result     = document.querySelector("#result")
let posts      = document.querySelector("#posts")
let logout      = document.querySelector("#logout")

logout.addEventListener("click", () => {
  axios.post(`/api/v1/logout`)
  .then(function (response) {
    console.log(response);
    // Display a success message for logout, if needed
    Swal.fire({
      icon: 'success',
      title: 'Logout Successful',
      showConfirmButton: false,
      timer: 1500 // Display success message for 1.5 seconds
    });
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);
  })
  .catch(function (error) {
    console.log(error);
  });
 
});

createPost.addEventListener("submit", (e)=>{
    e.preventDefault()
    let PostTitle  = document.querySelector("#PostTitle").value
    let PostText   = document.querySelector("#PostText").value
   axios.post(`/api/v1/post`, {
        PostTitle : PostTitle,
        PostText: PostText
      })
      .then(function (response) {
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Post Created',
          showConfirmButton: false,
          timer: 1500 // Display success message for 1.5 seconds
        });
        result.innerHTML = `Post Created`;
        getAllPosts();
      })
      .catch(function (error) {
        console.log(error);
      });
})
let getAllPosts = () => { 

  axios.get('/api/v1/posts', {
    withCredentials: true
  })

 
  .then(function (response) {
    console.log(response); // Check the response data structure in the console
   // Clear the existing posts before appending new ones
  setTimeout(()=>{
    result.innerHTML = ""
  },2000)
   
    posts.innerHTML = "";
    if (response.data.length === 0) {
      // No posts available, display "No Posts Yet" message
      let noPostsCard = document.createElement("div");
      noPostsCard.classList.add("post-card");
      let noPostsMessage = document.createElement("p");
      noPostsMessage.textContent = "No Posts Yet";
      noPostsMessage.style.fontSize = "1.5rem"
      noPostsCard.appendChild(noPostsMessage);
      posts.appendChild(noPostsCard);
    }
    response.data.forEach((myPosts) => {
      let postCard = document.createElement("div");
      postCard.classList.add("post-card");
      posts.appendChild(postCard);
      let userName = document.createElement("div")
      userName.textContent = myPosts.from
      postCard.appendChild(userName)
      
let headingAndButton = document.createElement("div")
headingAndButton.classList.add("parent")
postCard.appendChild(headingAndButton)
let headerTitle = document.createElement("div")
headingAndButton.appendChild(headerTitle)
      let heading = document.createElement("h1");
      heading.classList.add("postHeading")
      heading.textContent = myPosts.PostTitle;
      let para = document.createElement("p");
      para.classList.add("myPara")
      para.textContent = myPosts.PostText;
let buttons = document.createElement("div")
headingAndButton.appendChild(buttons)
      let editbutton = document.createElement("button");
      editbutton.textContent = "Edit";
      editbutton.classList.add("editButton"); // Use a class instead of an ID

      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("deleteButton"); // Use a class instead of an ID

      headerTitle.appendChild(heading);
      buttons.appendChild(editbutton);
      buttons.appendChild(deleteButton);
      postCard.appendChild(para);
      

      // editbutton.addEventListener('click', async (e) => {
      //   e.preventDefault();
      //   let updatedTitle = prompt("Enter title");
      //   let updatedText = prompt("Enter Text");
      //   console.log(updatedTitle);

      //   try {
      //     const post = {
      //       _id: myPosts._id, // Replace with the actual _id of the post
      //       PostTitle: updatedTitle,
      //       PostText: updatedText
      //     };
        
      //     const response = await axios.put(`/api/v1/post/${post._id}`, post);
      //     // Show SweetAlert popup or perform other actions as needed
      //     console.log(response.data);
      //   } catch (error) {
      //     console.log("Error in editing the post", error);
      //   }
      // });
      editbutton.addEventListener('click', (e) => {
        // e.preventDefault();
      
        // Show SweetAlert popup for editing post
        Swal.fire({
          title: 'Edit Post',
          html: `
          <label for="updatedTitle" class="swal2-label">Post Title:</label><br><input type="text" id="updatedTitle" value="${myPosts.PostTitle}" class="swal2-input" placeholder="Title" required><br>
          <label for="updatedText" class="swal2-label">Post Text:</label> <br> <input type="text" id="updatedText" value= "${myPosts.PostText}"  class="swal2-input" ></input>`,
          confirmButtonText: 'Edit',
          focusConfirm: false,
          preConfirm: () => {
            const updatedTitle = Swal.getPopup().querySelector('#updatedTitle').value;
            const updatedText = Swal.getPopup().querySelector('#updatedText').value;
            return { updatedTitle, updatedText };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const { updatedTitle, updatedText } = result.value;
      
            // Make the PUT request for the specific post ID with updated data
            axios.put(`/api/v1/post/${myPosts.id}`, {
              PostTitle: updatedTitle,
              PostText: updatedText
            })
            .then(function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Post Updated',
                showConfirmButton: false,
                timer: 1500 // Display success message for 1.5 seconds
              });
              getAllPosts()
              // ... Update the post content in the UI ...
            })
            .catch(function (error) {
              console.log("Error in editing the post");
            });
          }
        });
      });
      deleteButton.addEventListener("click", (e) => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You won\'t be able to revert this!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(`/api/v1/post/${myPosts.id}`)
            .then(function () {
              Swal.fire({
                icon: 'success',
                title: 'Post Deleted',
                showConfirmButton: false,
                timer: 1500 // Display success message for 1.5 seconds
              });
              getAllPosts(); // Refresh the post list
            })
            .catch(function () {
              console.log("Error in deleting the post");
            });
          }
        });
      });
    });
  })
  .catch(function (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      window.location.href = "./login.html";
    }
  });
};

getAllPosts();





// //var check = document.getElementById('word').value;
// // if(check != ""){
// //   // show "delete" icon
// // }
