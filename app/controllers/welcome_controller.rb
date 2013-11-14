class WelcomeController < ApplicationController

	def index
    	@home = true
    	if session[:user_id] == nil
    		render :index
    	else
    		redirect_to new_user_path
    	end
  	end

end