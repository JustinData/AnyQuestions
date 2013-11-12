class UsersController < ApplicationController

	before_action :authenticated!, except: [:new, :create]

	def index
		@users = User.all
	end

	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)

		if @user.save
    	redirect_to users_path 
  	else
    	render :new
  	end
  end

	private

	def user_params
		params.require(:user).permit(:name, :email, :password, :password_confirmation)
	end

	def authorized!
  	unless @user.id == session[:user_id]
  		redirect_to user_path(session[:user_id])
  	end
	end
end