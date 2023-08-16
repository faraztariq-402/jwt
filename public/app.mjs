let createPost = document.querySelector("#createPost")

let result     = document.querySelector("#result")
let posts      = document.querySelector("#posts")

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
        result.innerHTML = `Post Created`
        getAllPosts()
      })
      .catch(function (error) {
        console.log(error);
      });
})
let getAllPosts = () => {
  axios.get('/api/v1/posts',{
    withCredentials: true
  })
      .then(function (response) {
          console.log(response); // Check the response data structure in the console
          
          // Clear the existing posts before appending new ones
          // posts.innerHTML = "";
posts.innerHTML = ""
          response.data.forEach((myPosts) => {
            posts.innerHTML +=
                `<div class="post-card">
                    <h3>${myPosts.PostTitle}</h3>
                    <p> ${myPosts.PostText} </p>
                </div> 
                <br />`
        })

      })
      .catch(function (error) {
          console.log(error);
          if(error.response.status === 401){
            window.location.href = "./login.html"
          }
      });
};
getAllPosts()
