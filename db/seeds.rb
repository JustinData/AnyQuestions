# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.destroy_all
User.create(name: 'Justin', email: 'icacnt@gmail.com', password_digest: 'decaff')
User.create(name: 'Joe', email: 'joe@shmoe.com', password_digest: 'decaff')
User.create(name: 'John', email: 'john@doe.com', password_digest: 'decaff')
