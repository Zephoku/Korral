var myRef = new Firebase("https://korral.firebaseio.com");
var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    //console.log("User ID: " + user.uid + ", Provider: " + user.provider);
  } else {
    window.location.replace("/index1.html")
  }
});

$( document ).ready(function() {
  $('#fblogout').click(function(e) {
    e.preventDefault();
    authClient.logout();
    window.location.replace("/index1.html")
  });

});
