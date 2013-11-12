class Question < ActiveRecord::Base
  acts_as_voteable

  validates :details, presence: true
end
