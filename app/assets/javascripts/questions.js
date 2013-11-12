$(function(){
  addList();

  /* UI for rolling up container */
  toggleList();
});
 
function addList(){
  var input;
  var form = $('form');
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

  var colors = ["red", "blue", "goldenrod", "green"];
  var outerDiv = $('<div class="item">');

  var innerDiv = $("<div class='item-content'>")
  innerDiv.text(question.id + " " +  question.details + " posted by User " + question.user_id);
  innerDiv.css("background", _.sample(colors));

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
