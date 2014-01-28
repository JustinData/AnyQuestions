var roomQuestionList = new QuestionList();

/********** MODEL ***************/

//Question object - this mirrors server/database entry

function Question(q, uId, qId) {
  this.details = q;
  this.votes = 0;
  this.answered = false;
  this.paused = false;
  this.userId = uId;
  this.id = qId;
}

//Question object methods
//Upvote a question
Question.prototype.upVote = function() {
  this.votes = this.votes + 1;
};

//Mark a question answer
Question.prototype.answer = function() {
  this.answered = true;
};

// Question list object - this is a collection of Question Objects
function QuestionList() {
  this.questions = [];
}

//Question list methods
QuestionList.prototype.sort = function() {
  this.questions = _.sortBy(this.questions, function(element){return element.votes;});
};

QuestionList.prototype.addQuestion = function( qObj ) {
  this.questions.push( qObj );
  this.sort();
};

//======= end of model =========//

/********** VIEWS ***************/
/* Answer
/* Question
/* Votes
/* Listeners
/********************************/


//Add a listener to the form to allow new questions to be created
function viewFormListener(){
  var form = $('.question-form');
  var session_id = $('#session_id').text();
  form.submit( function( event ) {
    event.preventDefault();

    //Get the question
    var question = $('input.question').val(); 

    //Clear input box now that we have input
    $('input.question').val("");

    //Create ajax request with the question and the user_id
    //Sends the server return to controller to update the questions collection and render the question to the page.
    $.ajax({
      url: "/json/questions",
      type: "POST",
      data: { question: {details: question, user_id: session_id}},
      success: controllerUpdateNewQuestion
    });
  });
}


//If the question is answerable by the user, add this to the div.

function viewRenderAnswerable(question){
  var myDiv = $('div[data-val=' + question.id + ']');
  var answerableDiv = $("<div class=answerable>&radic;</div>");

  $(myDiv.children()[1]).append(answerableDiv);
}

//render a question
function viewRenderQuestion(question){
  var colors = ["purple", "orange", "red", "blue", "yellow", "green"];
  var outerDiv = $('<div class="item">');

  var innerDiv = $("<div class='item-content' data-val=" + question.id + ">");
  innerDiv.text(question.details);
  innerDiv.css("background", _.sample(colors));

  // build the upvote button & attach it to the inner div
  var upButton = $('<div class="upButton">&oplus;</div>');
  innerDiv.append(upButton);

  //build the votes div
  var votesDiv = $("<div class=votesDiv>0</div>");
  innerDiv.append(votesDiv);

  //append the div with the new question.
  outerDiv.append(innerDiv);
  $('div.packery').append(outerDiv);
  pckry.appended( outerDiv[0] );
}

//remove a question from the DOM (aka, it was answered)
function viewRemoveQuestion(question){
  var myDiv = $('div[data-val=' + question.id + ']');
  myDiv.remove();
}

//display how many votes the question has
function viewRenderVotes(question){
  // var myDiv = $('div[data-val=' + question.id + ']');
  // $(myDiv.children()[1]).html(question.votes);
  // More precise selection of votes div.
  $('div[data-val=' + question.id + '] .votesDiv')[0].html(question.votes);
}


//using delegated listeners for all the little actions
function viewAddDelegatedListeners(){
  $('div.packery').on('click', 'div.upButton', controllerUpVote);
  $('div.packery').on('click', 'div.answerable', controllerAnswer);
}

//======= end of views =========//

/********** CONTROLLER **********/

//called to setup everything on a page refresh
function controllerSetup(){
  $.ajax({
    url: "/json/questions",
    type: "GET",
    success: controllerBuildModel
  });
}

//build the model from a list of unanswered questions returned from the server.
//called only once with the page loads.
function controllerBuildModel(serverResponse){
  var numQuestions = serverResponse[0].questions.length;

  for (var i = 0; i < numQuestions; i++){
    var tempQuestion = new Question(serverResponse[0].questions[i].details, serverResponse[0].questions[i].user_id, serverResponse[0].questions[i].id);
    roomQuestionList.addQuestion(tempQuestion);
    viewRenderQuestion(tempQuestion);
  }
  controllerVoteSetup();
  controllerAnswerableSetup();
}

//setup the votes - 
//for every question in the roomQuestionList
//    ask the server how many votes the question has!
function controllerVoteSetup(){
  var numQuestions = roomQuestionList.questions.length;
  for (var i = 0; i < numQuestions; i++){

    $.ajax({
    url: "/json/questions/" + roomQuestionList.questions[i].id + "/getvotes",
    type: "GET",
    data: { question: {id: roomQuestionList.questions[i].id}},
            success:controllerUpdateVotes
        });
    };
}

//update the votes - the success handler for the vote ajax request.
//when the votes are updated, sort the roomQuestionList, then render votes.
function controllerUpdateVotes(serverResponse){
  var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
  var index = $.inArray(serverResponse[0].question.id, tempArray);

  roomQuestionList.questions[index].votes = serverResponse[1].votes;
  roomQuestionList.sort();
  viewRenderVotes(roomQuestionList.questions[index]);
  //redisplay();
}

//Takes the server response from posting a new question 
//Instantiates a new Question object
//Then places that object in the Questions collection 
//Next renders the question object to the page.
//Finally renders the button to mark a question answered
//
//It appears the last part is being called because this function is only called on the server return when creating a new question.  Thus all questions rendered by this function will be answerable.  To re-use this function elsewhere please verify that the answerability of a question is being accounted for before it is automatically rendered to the DOM.
function controllerUpdateNewQuestion(serverResponse){
  tempQuestion = new Question(serverResponse.details, serverResponse.user_id, serverResponse.id);
  roomQuestionList.addQuestion(tempQuestion);
  viewRenderQuestion(tempQuestion);
  viewRenderAnswerable(tempQuestion);
}

//launch an ajax request to the server to upvote a question
function controllerUpVote(){
  var session_id = $('#session_id').text();
  var question_id = $(this.parentElement).data().val;
  var url = "/json/questions/" + question_id + "/vote_up";

  $.ajax({
      url: url,
      type: "POST",
      data: { question: {id: question_id}},
      success: controllerUpdateVotes
    });
}

//ajax request for each question - can the user who is logged in answer it?
function controllerAnswerableSetup(){
  var numQuestions = roomQuestionList.questions.length;
  for (var i = 0; i < numQuestions; i++){

    $.ajax({
    url: "/json/questions/" + roomQuestionList.questions[i].id + "/getanswerable",
    type: "GET",
    data: { question: {id: roomQuestionList.questions[i].id}},
      success: controllerUpdateAnswerable
      });
  }
}

//the server has decided i can answer this - so render an answer button.
function controllerUpdateAnswerable(serverResponse){
  //TODO: dry this up into a helper function aka controllerHelperMap(serverResponse)
  var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
  var index = $.inArray(serverResponse[0].question.id, tempArray);

  viewRenderAnswerable(roomQuestionList.questions[index]);
}

//when the user clicks on answer, send an ajax request to server.
function controllerAnswer(){
  console.log("this question was just answered!");
  // now go tell the server this question was answered!
  // TODO - this is one level higher than vote because of the nesting
  // that is happening - it shouldn't be.
  var question_id = $(this.parentElement.parentElement).data().val;

  var url = "/json/questions/" + question_id + "/answered";

  $.ajax({
      url: url,
      type: "POST",
      data: { question: {id: question_id}},
      success: controllerUpdateAnswer
    });
}

//when the server comes back, update the model and display
function controllerUpdateAnswer(serverResponse){
  //remove from the model - find it in the model.  then mark it answered
  var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
  var index = $.inArray(serverResponse[0].question.id, tempArray);
  roomQuestionList.questions[index].answer();

  //remove from the dom
  viewRemoveQuestion(roomQuestionList.questions[index]);
}

function redisplay(){
  //delete this shit.
  elems = pckry.getItemElements();
  for (var i=0; i<elems.length; i++){
    pckry.remove(elems[i]);
  }

  //sort local model
  roomQuestionList.sort();


  //build this shit.
  numberOfQuestions = roomQuestionList.questions.length;
  for( i=0; i<numberOfQuestions; i++){
    var question = roomQuestionList.questions[i];

    var colors = ["purple", "orange", "red", "blue", "yellow", "green"];
    var outerDiv = $('<div class="item">');

    var innerDiv = $("<div class='item-content' data-val=" + question.id + ">");
    innerDiv.text(question.details);

    if (question.votes >= 5) {
      innerDiv.css("background", "red");
    } else if ((question.votes >= 3) && (question.votes < 5)) {
      innerDiv.css("background", "yellow");    
    } else if (question.votes < 2) {
      innerDiv.css("background", "green");
    }

    // build the upvote button & attach it to the inner div
    var upButton = $('<div class="upButton">&oplus;</div>');
    innerDiv.append(upButton);

    //build the votes div
    var votesDiv = $("<div class=votesDiv>"+question.votes+"</div>");
    innerDiv.append(votesDiv);

    //append the div with the new question.
    outerDiv.append(innerDiv);

    $('div.packery').append(outerDiv);
    pckry.prepended( outerDiv );
  }

  //should we remove answerable here?
  //setTimeout(controllerAnswerableSetup(),200);
}


function viewToggleList() {
  $("p").hide();
  $("h1").click(function() {
    $(this).next().slideToggle(300);
  });
}

function timedRefresh(timeoutPeriod) {
  var answerTO = timeoutPeriod + 1000;
  setTimeout(redisplay, timeoutPeriod);
  setTimeout(controllerAnswerableSetup, answerTO);
}

window.onload = function(){
  
  controllerSetup();
  
  viewFormListener();
  viewAddDelegatedListeners();
  
  viewToggleList();
  timedRefresh(5000);

};