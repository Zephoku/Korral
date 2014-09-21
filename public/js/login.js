var myRef = new Firebase("https://korral.firebaseio.com");
var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    //console.log("User ID: " + user.uid + ", Provider: " + user.provider);
  } else {
    // user is logged out
  }
});

$( document ).ready(function() {
    var date = new Date();
  $('#fblogin').click(function(e) {
    e.preventDefault();

    var defaultCat = [{ 
      id: "VIDEO",
    name: "VIDEO" ,
    color: "#f49656",
    icon: "images/video.png",
    links: [] 
    },
    {
      id: "TUTORIALS",
    name: "TUTORIALS" ,
    color: "#8dd3c7",
    icon: "images/tutorial.png",
    links: [] 
    },
    {
      id: "SCHOOL",
    name: "SCHOOL" ,
    color: "#bebada",
    icon: "images/school.png",
    links: [] 
    },
    {
      id: "ARTICLES",
      name: "ARTICLES" ,
      color: "#fb8072",
        icon: "images/articles.png",
        links: [] 
  }];
console.log(JSON.stringify(defaultCat));
    authClient.login("facebook").then(function() {
        $.ajax({
          type: 'POST', 
          url: '/user1/categories', 
          data: JSON.stringify(defaultCat[0]),
          contentType: "application/json",
        }).done( function(data) {
        });
window.setTimeout("", 500);
        $.ajax({
          type: 'POST', 
          url: '/user1/categories', 
          data: JSON.stringify(defaultCat[1]),
          contentType: "application/json",
        }).done( function(data) {
        });
window.setTimeout("", 500);
        $.ajax({
          type: 'POST', 
          url: '/user1/categories', 
          data: JSON.stringify(defaultCat[2]),
          contentType: "application/json",
        }).done( function(data) {
        });
window.setTimeout("", 500);
        $.ajax({
          type: 'POST', 
          url: '/user1/categories', 
          data: JSON.stringify(defaultCat[3]),
          contentType: "application/json",
        }).done( function(data) {
        });
          setTimeout(window.location.replace("/index.html"),
            2000);
        

    });

  });
});
