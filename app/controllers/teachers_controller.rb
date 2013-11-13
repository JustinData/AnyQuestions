class TeachersController < ApplicationController

  def index
    @teachers = User.all #?????
  end


end