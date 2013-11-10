class CreateTables < ActiveRecord::Migration
	
  def change
    create_table :users do |t|
    	t.integer :user_id
    	t.string :name, null: false
    	t.string :email, null: false
    	t.string :password_digest, null: false
    	t.boolean :teacher, default: false

    	t.timestamps
    end

    create_table :questions do |t|
    	t.integer :question_id
    	t.string :title
    	t.boolean :answered, default: false
    	t.text :details, null: false
    	t.integer :user_id
    	t.foreign_key :users

    	t.timestamps
    end

    create_table :upvotes do |t|
    	t.integer :user_id
    	t.foreign_key :users
    	t.integer :question_id
    	t.foreign_key :questions 

    	t.timestamps   	
    end

    create_table :comments do |t|
    	t.integer :comment_id
    	t.integer :user_id
    	t.foreign_key :users
    	t.integer :question_id
    	t.text :details

    	t.timestamps
    end
  end
end

