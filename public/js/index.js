$( document ).ready(function() { 
  var colors = ['#f49656', '#8dd3c7', '#bebada', '#fb8072', '#80b1d3', '#fdbf62'];
  var images = ['images/video.png', 'images/tutorial.png', 'images/school.png', 'images/articles.png'];
  $.ajax({ 
    type: 'GET', 
    url: '/user/categories', 
  }).done( function(data) { 
    console.log(data); 
    for (var key in data) {
      $('.squares').prepend(buildSquare(data[key].color, data[key].name, data[key].icon));
    }
  }).fail(function() { 
  }).always(function(data) { 
  });

  $("#newCategory").click(function() {
    console.log("succes");
    $('#myModal').modal('hide');
    var category = $('#categoryName').val();
    $('#categoryName').val("");
    var color = pickAtRandom(colors);
    var image = pickAtRandom(images);
    $('.squares').prepend(buildSquare(color, category, image));
    console.log(category);
    var date = new Date();

    var newCat = { 
        id: "a" + date.getTime(),
        name: category,
        color: color,
        icon: image,
        links: [] 
      };

    $.ajax({
      type: 'POST', 
      url: '/user1/categories', 
      data: JSON.stringify(newCat),
      contentType: "application/json",
      done: function (data) { 
        console.log("Done");
      }
    });
  });
});


function pickAtRandom(colors) {
  var index = Math.floor((Math.random() * colors.length));
  return colors[index];
}

function loadajax(){

}

function buildSquare(color, name, icon) {
  return [
    '<div class="square" style="background:'+color+';float:left;" ondrop="drop(event)" id="dropzone" ><img />',
       '<h1 class="category" style="font-family: \'Raleway\', sans-serif; color:#fff; font-weight:400;text-align:center;margin-top:15%;">'+name+'</h1>',
        '<center><img class="img-responsive" src="'+icon+'" style="width:80px;height:auto;"></center>',
       '</div'
  ].join('\n');
}
