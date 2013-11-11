class User < ActiveRecord::Base
	validates :email, presence: true, uniqueness: true
	validates :name, presence: true

	has_secure_password

	has_many :questions
end