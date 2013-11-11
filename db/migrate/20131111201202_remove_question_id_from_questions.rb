class RemoveQuestionIdFromQuestions < ActiveRecord::Migration
  def change
    remove_column :questions, :question_id
    remove_column :questions, :title
  end
end
