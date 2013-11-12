class QuestionsController < ApplicationController
  def index
    @questions = Question.order("created_at ASC").all
    @user_id = session[:user_id]
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
 
  private 
 
  def question_params
    params.require(:question).permit(:details)
  end
  # { :id => 1, :question => { :questions => "why?", :answered => false } }
end
