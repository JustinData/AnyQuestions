var roomQuestionList = new QuestionList();


// Question object
function Question(q, uId, qId) {
	this.details = q;
	this.votes = 0;
	this.answered = false;
	this.paused = false;
	this.userId = uId;
	this.id = qId;
};

Question.prototype.upVote = function() {
	this.votes = this.votes + 1;
};

Question.prototype.answer = function() {
	this.answered = true;
};

// Question list object
function QuestionList() {
	this.questions = [];
};

QuestionList.prototype.sort = function() {
  this.questions = _.sort(this.questions, function(element){return element.votes;});
};

QuestionList.prototype.addQuestion = function( qObj ) {
	this.questions.push( qObj );
	// this.sort();
};

//===========


function controllerSetup(){
	$.ajax({
		url: "/json/questions",
		type: "GET",
		success: controllerBuildModel
	});
};

function controllerBuildModel(serverResponse){
	var numQuestions = serverResponse[0].questions.length;
	// console.log("here")
	for (var i = 0; i < numQuestions; i++){
		var tempQuestion = new Question(serverResponse[0].questions[i].details, serverResponse[0].questions[i].user_id, serverResponse[0].questions[i].id);
		roomQuestionList.addQuestion(tempQuestion);
		viewRenderQuestion(tempQuestion);
	};
	controllerVoteSetup();

};

function controllerVoteSetup(){
	var numQuestions = roomQuestionList.questions.length;
	for (var i = 0; i < numQuestions; i++){

		$.ajax({
		url: "/json/questions/" + roomQuestionList.questions[i].id + "/getvotes",
		type: "GET",
		data: { question: {id: roomQuestionList.questions[i].id}},
    	success: controllerUpdateVotes
    	});

	};
};

function controllerUpdateVotes(serverResponse){
	
	var tempArray = $.map(roomQuestionList.questions, function(question, i) { return question.id });
	var index = $.inArray(serverResponse[0].question.id, tempArray);

	roomQuestionList.questions[index].votes = serverResponse[1].votes;
	viewRenderVotes(roomQuestionList.questions[index])
};

function controllerUpdateNewQuestion(serverResponse){
	console.log(serverResponse);
	tempQuestion = new Question(serverResponse.details, serverResponse.user_id, serverResponse.id);
	roomQuestionList.addQuestion(tempQuestion);
	viewRenderQuestion(tempQuestion);
};

function viewRenderQuestion(question){
	console.log(question);
	var colors = ["red", "blue", "goldenrod", "green"];
	var outerDiv = $('<div class="item">');

	var innerDiv = $("<div class='item-content' data-val=" + question.id + ">")
	innerDiv.text(question.details);
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

function viewRenderVotes(question){
	// console.log("blah");
	var myDiv = $('div[data-val=' + question.id + ']');
	$(myDiv.children()[1]).html(question.votes);
}

function viewFormListener(){
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
      url: "/json/questions",
      type: "POST",
      data: { question: {details: question, user_id: session_id}},
      success: controllerUpdateNewQuestion
    });
  });
}

window.onload = function(){
	// console.log("onload");
	controllerSetup();

	viewFormListener();
	

};
//===============================

//  var q1 = new Question("How does OOP work?");

// q1.votes;
// //=>0

// q1.upVote();
// q1.votes;
// //=>1

// q1.answered;
// //=>false

// q1.answer();
// q1.answered;
// //=>true

// var questionArray = [q1,q2,q3,q4,q5];

  //add jquery to make the new question show up on the page

  //...

//-------------------------------------------------------------
// var questionList = new QuestionList();

// questionList.addQuestion( q1 );
// questionList.addQuestion( q2 );
// questionList.addQuestion( q3 );
// questionList.addQuestion( q4 );
// questionList.addQuestion( q5 );

// questionList.sort();