$.getJSON("/articles", function (data) {
  // For each one
  console.log("clicked!")
  for (var i = 0; i < data.length; i++) {// Display information on page
    $("#articles").append(
      `<div data-id="${data[i]._id}">
       <h1>${data[i].title}</h1>
       <img src="${data[i].image}"/> <button class="saveArticle" unique="${data[i].link}">Save Article</button>
       <p>${data[i].summary}</p>
       <a href="${data[i].link}">${data[i].link}</p>
     </div>`);
  }
})

$("#submitScrape").click(function () { //On page load, scrape all articles from our DB
  $.getJSON("/scrape", function (data) {
    console.log("clicked!")
    for (var i = 0; i < data.length; i++) {// Display information on the page
      $("#articles").append(
        `<div data-id="${data[i]._id}">
         <h1>${data[i].title}</h1>
         <img src="${data[i].image}"/> <button class="saveArticle" unique="${data[i].link}">Save Article</button>
         <p>${data[i].summary}</p>
         <a href="${data[i].link}">${data[i].link}</p>
       </div>`);
    }
  })
});

$("#saveArticle").click(function () {
  $.post("/saveArticle", JSON.stringify($(this).attr("unique")));
  console.log("unique tag is", JSON.stringify($(this).attr("unique")))
});

$("#savedArticles").click(function () {
  $.getJSON("/saved", function (data) {
    // For each one
    console.log("clicked!")
    for (var i = 0; i < data.length; i++) {// Display information on the page
      $("#articles").append(
        `<div data-id="${data[i]._id}">
           <h1>${data[i].title}</h1>
           <img src="${data[i].image}"/> <button class="saveArticle" unique="${data[i].link}">Save Article</button>
           <p>${data[i].summary}</p>
           <a href="${data[i].link}">${data[i].link}</p>
         </div>`);
    }
  });
})
$(document).on("click", "p", function () {
  // Empty the notes 
  $("#notes").empty();
  // Save the id from the <p> tag
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' >");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {

        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});
$(document).on("click", "#savenote", function () {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),

      body: $("#bodyinput").val()
    }
  })

    .then(function (data) {
      // Log the response
      console.log(data);

      $("#notes").empty();
    });


  $("#titleinput").val("");
  $("#bodyinput").val("");
});
