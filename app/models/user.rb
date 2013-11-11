class User < ActiveRecord::Base
	validates :email, presence: true, uniqueness: true
	validates :name, presence: true

	has_secure_password

  acts_as_voter

	has_many :questions
end