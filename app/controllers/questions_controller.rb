class QuestionsController < ApplicationController
  before_action :authenticated!, only: [:index]

  def index
    @questions = Question.order("created_at ASC").all
    @answered_questions = Question.where("answered = false").plusminus_tally
    @user_id = session[:user_id]
    # binding.pry
  end
 
  def create
    @question = Question.new(question_params)
  
    if @question.save
      render json: @question
    else
      render status: 400, nothing: true
    end
  end
 
  def new
    render :new
  end
 
  def update
    @question = Question.find(params[:id])

    if @question.update
      render status: 200, nothing: true
    else
      render status: 400, nothing: true
    end
  end
 
  def destroy
    @question = Question.find(params[:id])
 
    if @question.destroy
      render json: {}
    else
      render status: 400, nothing: true
    end
  end
 
  def vote_up
    begin
      #binding.pry
      current_user = User.find(session[:user_id])
      @the_question = Question.find(params[:id])
      
      if current_user.vote_for(@the_question)
        render json: [{question: @the_question}, {votes: @the_question.votes_for}]
      else
        render status: 400, nothing: true
      end
      # @questions = Question.order("created_at ASC").all
      # render :index

    rescue ActiveRecord::RecordInvalid
      render json: @the_question.votes_for
    end
  end

  private 
 
  def question_params
    params.require(:question).permit(:details, :user_id)
  end
  # { :id => 1, :question => { :questions => "why?", :answered => false } }
  def authorized!
    if session[:user_id] == nil
      redirect_to new_session_path
    end
  end

  def set_user
    @user = User.find(params[:id])
  end
end
