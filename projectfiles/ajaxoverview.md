MVC Ajax Overview 
===

Our page is basically empty when it loads, except for a critical div set up, into which we populate the questions.  All of it is managed through ajax requests and responses and the following is an overview of what happens when.

We followed an MVC naming convention to distinguish which part of the structure each function works on so each function is either controllerXXXX or viewXXXX.

##First
We instantiate a global variable, roomQuestionList, which is an instance of the QuestionList object.

```
// Question list object - this is an array of Question Objects
function QuestionList() {
  this.questions = [];
}
```

##On Our Page Load

We run the following functions:

```

	controllerSetup();
	viewFormListener();
	viewAddDelegatedListeners();
  
	viewToggleList();
	timedRefresh(5000);

```

The listeners handle all the clickable sections of each question, viewToggleList rolls the questions up, and the timedRefresh function is our initial attempt at polling.

All of the exciting AJAX starts from controllerSetup();

##controllerSetup
Go to the server and ask it for all of the unanswered questions.  When we get it back, go set up the model!

##controllerSetupModel
The response back from the server is parsed and made into our local Question model, basically creating a mirror of the database in the client.  As each question is added into the local model, we call viewRenderQuestion.  When we are done, on to controllerVoteSetup.

##viewRenderQuestion
This takes a client question object, builds a DOM element based on it, and inserts it into the DOM by attaching it to a div rendered by the server when the page is first loaded.

##controllerVoteSetup
For each question in the local model, send an ajax request to the server to find out how many votes this has.  A note on ordering: We decided to viewRenderQuestion first so that when the responses for the votes comes back, we have somewhere to put them.  Also of interest: because the votes are in a separate table on the server, separating this step seemed to make sense.  We could have sent the votes back in the question list requested by controllerSetup but decided this approach was more granular, especially since at a later point we will want to update individual elements as they happen without having to rebuild our model from scratch.

##controllerUpdateVotes
This is the success function of the ajax launched by controllerVoteSetup.  It updates our local model and also calls viewRenderVotes to display them.

##viewRenderVotes
Uses question object’s id o jQuery sleect the votes div for releveant question element in the DOM
updates selected div with vote value





2=
viewFormListener
jQuery selects question creation form
Creates submit listener on selectin
Prevents the default action
Stores the data from the form
Clears the form
AJAX POSTs question data and session ID
Passes returned data to controllerUpdateNewQuestion

controlelrUpdateNewQuestion
Creates instance of Question object from server response
Inserts instance of Question object into instance of questionList object
Build DOM element based on instance of Question object and inserts into DOM via viewRenderQuestion


3=
viewUpvoteListener
jQuery selects div with packery class and sets an on-click listener that calls controllerUpVote

controllerUpVote
jQuery selects parent element data value
Builds url from jQuery select
AJAX POST with created url to trigger adding vote in Questions Controller
Passes server response to controllerUpdateVotes
	
