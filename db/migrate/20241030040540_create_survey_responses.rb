class CreateSurveyResponses < ActiveRecord::Migration[7.2]
  def change
    create_table :survey_responses do |t|
      t.string :email, limit: 510
      t.references :survey, null: false, foreign_key: true
      t.text :responses

      t.timestamps
    end
    add_index :survey_responses, :email
  end
end
