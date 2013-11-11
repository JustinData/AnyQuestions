class DropUpvotesTable < ActiveRecord::Migration
  def change
    drop_table :upvotes
  end
end
