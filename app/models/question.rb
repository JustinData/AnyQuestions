class Question < ActiveRecord::Base

  # using thumbs_up gem
  acts_as_voteable

  # prevents entering null questions
  validates :details, presence: true

  # sets up AR relations
  belongs_to :user

end
