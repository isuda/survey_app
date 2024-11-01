class SurveyResponse < ApplicationRecord
  belongs_to :survey
  encrypts :email, deterministic: true
  serialize :responses, coder: JSON, type: Array
  encrypts :responses

  validates_associated :survey
  validates_presence_of :email, :responses
  validates_each :responses do |record, attr, value|
    if record.survey
      record.survey.questions.each do |q|
        q_resp = value.find { |resp| resp["question_id"] == q["id"] }
        if q_resp.nil?
          record.errors.add(attr, "Bad question responses")
        else
          record.errors.add(attr, "Bad question response value. Expected Numeric and got #{q_resp["value"].class}") if q["type"] == "scale" && !(q_resp["value"].is_a? Numeric)
          record.errors.add(attr, "Bad question response value. Expected String and got #{q_resp["value"].class}") if q["type"] == "text" && !(q_resp["value"].is_a? String)
        end
      end
    end
  end
end
