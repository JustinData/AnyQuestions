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
    var user = $.trim($(session_id).text());
    
    console.log(input);
    console.log(user);
 
    $('<li>').append(input).appendTo($('ol'));
    $('input.question').val("");
    $.ajax({
      url: "/questions",
      type: "POST",
      data: { question: {details: input, user_id: user}}
    });
  });  
}
 
  function toggleList() {
    $("p").hide();
    $("h1").click(function() {
    $(this).next().slideToggle(300);
  });
  }