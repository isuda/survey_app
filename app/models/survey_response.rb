class SurveyResponse < ApplicationRecord
  belongs_to :survey
  encrypts :email, deterministic: true
  serialize :responses, coder: JSON, type: Array
  encrypts :responses
end
