require "rails_helper"

RSpec.describe Survey do
  fixtures :surveys, :survey_responses

  before(:each) do
    @survey = surveys(:survey_one)
  end

  it "has many survey responses" do
    expect(@survey.survey_responses).to be_kind_of(ActiveRecord::Associations::CollectionProxy)
    expect(@survey.survey_responses.first).to be_kind_of(SurveyResponse)
  end
end
