$(function () {
  // ------------------------------------------ //
  //         Declaracion de funciones
  // ------------------------------------------ //
  //TODO Permitir filtrar la busqueda con mas detalle (inAuthor, inTitle, etc.) -> Quizas en varias funciones
  let getBooks = function () {
    $.ajax({
      url: "https://www.googleapis.com/books/v1/volumes",
      type: "GET",
      dataType: "json",
      data: {
        q: searchParams,
        key: "your-googleBooks-api-key",
      },
      success: function (data) {
        showResults(data);
      },
      error: function () {
        alert("nop");
      },
    });
  };

  let showResults = function (data) {
    // // console.log(data);
    // // console.log(data.items);

    // TODO Que la reseña sea un pop-up o algo asi, que no este en el item per se, porque son largas
    // TODO -> Autor deberia ser tambien un for en caso de que sea mas de uno

    $("#searchResultsContainer").empty();
    $("<div class='row gap-5' id='searchResults'></div>").appendTo(
      $("#searchResultsContainer")
    );

    for (var i = 0; i < data.items.length; i++) {
      var currentItem = "bookItem" + i;

      $(".footer").css("position", "static");

      $(
        "<div class='col-sm-4 p-4 m-auto text-center rounded shadow bookItem' id=" +
        currentItem +
        "></div>"
      ).appendTo("#searchResults");

      $(
        "<a class= 'titulo text-break m-0' target='_blank' href=" +
        data.items[i].volumeInfo.canonicalVolumeLink +
        "><b>Titulo:</b> " +
        data.items[i].volumeInfo.title +
        "</a>"
      ).appendTo($(`#${currentItem}`));

      if (data.items[i].volumeInfo.authors) {
        $(
          "<p class= 'autor text-break m-0'><b>Autor/es:</b> " +
          data.items[i].volumeInfo.authors[0] +
          "</p>"
        ).appendTo($(`#${currentItem}`));
      } else {
        $(
          "<p class= 'autor text-break m-0'><b>Autor/es:</b> No especificado </p>"
        ).appendTo($(`#${currentItem}`));
      }

      if (data.items[i].volumeInfo.publishedDate) {
        $(
          "<p class= 'publicado text-break m-0'><b>Publicado:</b> " +
          data.items[i].volumeInfo.publishedDate +
          "</p>"
        ).appendTo($(`#${currentItem}`));
      } else {
        $(
          "<p class= 'publicado text-break m-0'><b>Publicado:</b> Sin especificar </p>"
        ).appendTo($(`#${currentItem}`));
      }

      if (data.items[i].volumeInfo.publisher) {
        $(
          "<p class= 'publisher text-break'><b>Publicado por:</b> " +
          data.items[i].volumeInfo.publisher +
          "</p>"
        ).appendTo($(`#${currentItem}`));
      } else {
        $(
          "<p class= 'publisher text-break'><b>Publicado por:</b> Sin especificar </p>"
        ).appendTo($(`#${currentItem}`));
      }

      if (data.items[i].volumeInfo.imageLinks) {
        if (data.items[i].volumeInfo.imageLinks.thumbnail) {
          $(
            "<img class= 'foto' src=\"" +
            data.items[i].volumeInfo.imageLinks.thumbnail +
            '"width=128 height=192 </img>'
          ).appendTo($(`#${currentItem}`));
        } else if (data.items[i].volumeInfo.imageLinks.smallThumbnail) {
          $(
            "<img class= 'foto' src=\"" +
            data.items[i].volumeInfo.imageLinks.smallThumbnail +
            '"width=128 height=192 </img>'
          ).appendTo($(`#${currentItem}`));
        } else {
          let bookCover = new Image();
          bookCover.src = "img/bookCover.png";
          $(
            "<img class= 'foto' src=" +
            bookCover.src +
            '" width=128 height=192 </img>'
          ).appendTo($(`#${currentItem}`));
        }
      } else {
        let bookCover = new Image();
        bookCover.src = "img/bookCover.png";
        $(
          "<img class= 'foto' src=" +
          bookCover.src +
          " width=128; height=192 </img>"
        ).appendTo($(`#${currentItem}`));
      }
    }
  };

  function checkBookName(searchParams, getBooks) {
    if (!searchParams) {
      alert("Pone algo para buscar gil");
    } else {
      // console.log(searchParams);
      getBooks();
    }
  }

  // ------------------------------------------ //
  //         Llamadas a funciones
  // ------------------------------------------ //

  // ------------------------------------------ //
  //         Event Listeners
  // ------------------------------------------ //

  let searchParams;
  //let searchOption = 'Book';

  $("#searchParams").change(function () {
    searchParams = $("#searchParams").val();
    // console.log($("#searchParams").val());
  });

  $("#searchParams").on("keyup", function (e) {
    if (e.keyCode === 13) {
      searchParams = $("#searchParams").val();
      checkBookName(searchParams, getBooks);
      // console.log($("#searchParams").val());
    }
  });

  $("#searchButton").on({
    click: function () {
      checkBookName(searchParams, getBooks);
    },
  });

  // $('#searchOptions').change(function () {
  //     searchOption = $('#searchOptions option:selected').val();
  //     // console.log($('#searchOptions option:selected').val());
  // });
});