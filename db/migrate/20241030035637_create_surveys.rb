class CreateSurveys < ActiveRecord::Migration[7.2]
  def change
    create_table :surveys do |t|
      t.string :name
      t.jsonb :questions

      t.timestamps
    end
    add_index :surveys, :name
  end
end
