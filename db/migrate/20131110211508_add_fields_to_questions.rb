class AddFieldsToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :paused, :boolean, default: false
    add_column :questions, :dismissed, :boolean, default: false
  end
end
