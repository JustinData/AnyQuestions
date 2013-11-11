class UsersController < ApplicationController

	before_action :set_user , :authenticated!, :authorized!, only: [:show] 

	def index
		@users = User.all
	end

	def new
		@user = User.new
	end

	def show
		
	end

	def create
		@user = User.new(user_params)

		if @user.save
      		redirect_to users_path #user_path(@user)
    	else
      		render :new
    	end
	end

	private
	def user_params
		params.require(:user).permit(:email, :password, :password_confirmation, :name)
	end

	def authorized!
    	unless @user.id == session[:user_id]
    		redirect_to user_path(session[:user_id])
    	end
  	end

	def set_user
    	@user = User.find(params[:id])
  	end
end