// Question object
function Question(q, uId, qId) {
	this.details = q;
	this.votes = 0;
	this.answered = false;
	this.paused = false;
	this.userId = uId;
	this.questionId = qId;
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
	console.log(serverResponse);
	var numQuestions = serverResponse[0].questions.length;
	for (var i = 0; i < numQuestions; i++){
		var tempQuestion = new Question(serverResponse[0].questions[i].details, serverResponse[0].questions[i].user_id, serverResponse[0].questions[i].id);
		roomQuestionList.addQuestion(tempQuestion);
	};
};

function controllerVoteSetup(){
	var numQuestions = roomQuestionList.questions.length;
	for (var i = 0; i < numQuestions; i++){

		$.ajax({
		url: "/json/questions/" + roomQuestionList.questions[i].questionId + "/getvotes",
		type: "GET",
		data: { question: {id: roomQuestionList.questions[i].questionId}},
    	success: controllerUpdateVotes
    	});

	};
};

function controllerUpdateVotes(serverResponse){
	console.log(serverResponse);
};

window.onLoad = function(){
	console.log("onload");
	var roomQuestionList = new QuestionList();
	
	controllerSetup();

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