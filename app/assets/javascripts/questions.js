//TODO make it into a model

$(function(){
  addList();

  /* UI for rolling up container */
  toggleList();

  /* set up delegated listener for upvotes */
  // delegated listener: $('#game').on('click', 'div.column', cardClick);
  //$('div.item').on('click', 'img.upButton', upVoteClick);
  $('div.packery').on('click', 'div.upButton', upVoteClick);

});
 
function addList(){
  var input;
  var form = $('.question-form');
  var session_id = $('#session_id').text();
  form.submit( function( event ) {
    event.preventDefault();

    //get the question
    var question = $('input.question').val(); 

    //clear input box now that we have input
    $('input.question').val("");

    //create ajax request with the question and the user_id
    $.ajax({
      url: "/questions",
      type: "POST",
      data: { question: {details: question, user_id: session_id}},
      success: appendQuestion
    });
  });  
}

//pending successful AJAX request - aka, don't display the question until we know it is persisted on server
function appendQuestion(question) {
  console.log(question);

  var colors = ["purple", "orange", "red", "blue", "yellow", "green"];
  var outerDiv = $('<div class="item">');

  var innerDiv = $("<div class='item-content' data-val=" + question.id + ">")
  innerDiv.text(question.details + " posted by User " + question.user_id);
  innerDiv.css("background", _.sample(colors));

  // build the upvote button & attach it to the inner div
  var upButton = $('<div class="upButton">&oplus;</div>');
  innerDiv.append(upButton);
 
  //build the votes div
  var votesDiv = $("<div class=votesDiv>0</div>")
  innerDiv.append(votesDiv);

  //append the div with the new question.
  outerDiv.append(innerDiv);
  $('div.packery').append(outerDiv);
  pckry.appended( outerDiv[0] );
}
 
/**** Handles roll up of all the questions ****/
function toggleList() {
  $("p").hide();
  $("h1").click(function() {
    $(this).next().slideToggle(300);
  });
}

var transitionProp = getStyleProperty('transition');
var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProp ];


docReady( function() {
  var container = document.querySelector('.packery');
  window.pckry = new Packery( container );
  
  eventie.bind( container, 'click', function( event ) {
    // don't proceed if item content was not clicked on
    var target = event.target;
    if ( !classie.has( target, 'item-content' )  ) {
      return;
    }

    var previousContentSize = getSize( target );
    // disable transition
    target.style[ transitionProp ] = 'none';
    // set current size 
    target.style.width = previousContentSize.width + 'px';
    target.style.height = previousContentSize.height + 'px';

    var itemElem = target.parentNode; 
    var isExpanded = classie.has( itemElem, 'is-expanded' );
    classie.toggleClass( itemElem, 'is-expanded' );

    // force redraw
    var redraw = target.offsetWidth;
    // renable default transition
    target.style[ transitionProp ] = '';

    // reset 100%/100% sizing after transition end
    if ( transitionProp ) {
      var onTransitionEnd = function() {
        target.style.width = '';
        target.style.height = '';
        target.removeEventListener( transitionEndEvent, onTransitionEnd, false );
      };
      target.addEventListener( transitionEndEvent, onTransitionEnd, false );
    }
    
    // set new size
    var size = getSize( itemElem );
    target.style.width = size.width + 'px';
    target.style.height = size.height + 'px';

    if ( isExpanded ) {
      // if shrinking, just layout
      pckry.layout();
    } else {
      // if expanding, fit it
      pckry.fit( itemElem );
    }
  });
});

function upVoteClick (){
  console.log("you voted it up, congrats!");
  var session_id = $('#session_id').text();
  var question_id = $(this.parentElement).data().val;
  var url = "/questions/" + question_id + "/vote_up";
  console.log(url);

  $.ajax({
      url: url,
      type: "POST",
      data: { question: {id: question_id}},
      success: updateVotes
    });
}

//i need to get the votes AND the question id
function updateVotes(server_response){
  console.log(server_response);

  server_response[0].question.id;
  server_response[1].votes;
  
  var myDiv = $('div[data-val=' + server_response[0].question.id + ']');
  $(myDiv.children()[1]).html(server_response[1].votes);

}
