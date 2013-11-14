class Json::QuestionsController < ApplicationController
  
  def index
    @questions = Question.order("created_at ASC").all
    @unanswered_questions = Question.where("answered = false").plusminus_tally
    @user_id = session[:user_id]
    # binding.pry
    render json: [{questions: @unanswered_questions}] and return
    
  end

  def getvotes
    @the_question = Question.find(params[:id])
    render json: [{question: @the_question}, {votes: @the_question.votes_for}] and return
  end

  def vote_up

    current_user = User.find(session[:user_id])
    @the_question = Question.find(params[:id])

    current_user.vote_for(@the_question)
  
    render json: [{question: @the_question}, {votes: @the_question.votes_for}]

  end


  def create
    # binding.pry
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