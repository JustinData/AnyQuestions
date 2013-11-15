class Json::QuestionsController < ApplicationController

# namespaced json controller to handle all the ajax requests from the page 

  #build the room from all of the current unanswered rooms - from a page refresh.
  def index
    #@questions = Question.order("created_at ASC").all
    @unanswered_questions = Question.where("answered = false").plusminus_tally
    #@user_id = session[:user_id]
    render json: [{questions: @unanswered_questions}] and return
  end

  #GET json/question/:id/getvotes
  #find out all the votes a certain question has
  def getvotes
    @the_question = Question.find(params[:id])
    render json: [{question: @the_question}, {votes: @the_question.votes_for}] and return
  end

  #POST json/question/:id/vote_up
  #vote for the question using thumbs_up method.
  #TODO: should return something else if error.
  def vote_up
    current_user = User.find(session[:user_id])
    @the_question = Question.find(params[:id])

    current_user.vote_for(@the_question)
  
    render json: [{question: @the_question}, {votes: @the_question.votes_for}]
  end

  #GET json/question/:id/getanswerable
  #find out if the user who is logged in can answer this particular question.
  #TODO: add in verification for Teacher Role
  def getanswerable
    @the_question = Question.find(params[:id])
    @user_id = session[:user_id]
    if @the_question.user.id == @user_id
      render json: [{question: @the_question}]
    end
  end

  #POST json/question/:id/answered
  #make the question answered, save it, return it as json obj.
  def answered
    @the_question = Question.find(params[:id])
    @the_question.answered = true
    @the_question.save
    render json: [{question: @the_question}]
  end


  #create a new question, save it, return it as a json obj.
  def create
    @question = Question.new(question_params)

    if @question.save
      render json: @question
    else
      render status: 400, nothing: true
    end
  end

  private

  def question_params
    params.require(:question).permit(:details, :user_id)
  end
end