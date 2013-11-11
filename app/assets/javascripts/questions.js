$(function(){
  addList();
  toggleList();
});
 
function addList(){
  var input;
  var form = $('form');
  form.submit( function( event ) {
    event.preventDefault();
    var input = $('input.question').val();
    console.log(input);
 
    $('<li>').append(input).appendTo($('ol'));
    $('input.question').val("");
    $.ajax({
      url: "/questions",
      type: "POST",
      data: { question: {question: input} }
    });
  });  
}
 
  function toggleList() {
    $("p").hide();
    $("h1").click(function() {
    $(this).next().slideToggle(300);
  });
  }