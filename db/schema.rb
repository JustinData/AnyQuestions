# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131110211508) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: true do |t|
    t.integer  "comment_id"
    t.integer  "user_id"
    t.integer  "question_id"
    t.text     "details"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "questions", force: true do |t|
    t.integer  "question_id"
    t.string   "title"
    t.boolean  "answered",    default: false
    t.text     "details",                     null: false
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "paused",      default: false
    t.boolean  "dismissed",   default: false
  end

  create_table "upvotes", force: true do |t|
    t.integer  "user_id"
    t.integer  "question_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.integer  "user_id"
    t.string   "name",                            null: false
    t.string   "email",                           null: false
    t.string   "password_digest",                 null: false
    t.boolean  "teacher",         default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_foreign_key "comments", "users", name: "comments_user_id_fk"

  add_foreign_key "questions", "users", name: "questions_user_id_fk"

  add_foreign_key "upvotes", "questions", name: "upvotes_question_id_fk"
  add_foreign_key "upvotes", "users", name: "upvotes_user_id_fk"

end
