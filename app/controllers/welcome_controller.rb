class WelcomeController < ApplicationController

	def index
    	@home = true
    	if session[:user_id] == nil
    		render :index
    	else
    		redirect_to users_path
    	end
  	end

end