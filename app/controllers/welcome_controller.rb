class WelcomeController < ApplicationController

	def index
    @home = true
    render :index
  end

end