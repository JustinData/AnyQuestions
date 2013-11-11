class UsersController < ApplicationController
<<<<<<< HEAD
  acts_as_voter

	before_action :set_user , except: [:new, :create] 

=======
  
>>>>>>> 1fb4262f4b3209a0f7d901b900feab8569e00fff
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

	def set_user
    	@user = User.find(params[:id])
  	end
end