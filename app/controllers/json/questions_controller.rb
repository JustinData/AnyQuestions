class Json::QuestionsController < ApplicationController
  def index
    @questions = Question.order("created_at ASC").all
    @unanswered_questions = Question.where("answered = false").plusminus_tally
    @user_id = session[:user_id]
    # binding.pry
    render json: [{questions: @unanswered_questions}] and return
    
  end


# def create
#   @question = Question.new(question_params)

#   if @question.save
#     render json: @question
#   else
#     render status: 400, nothing: true
#   end
# end

end