require "rails_helper"

RSpec.describe SurveyResponse do
  fixtures :surveys, :survey_responses

  before(:each) do
    @survey = surveys(:survey_one)
    @response = survey_responses(:response_one)
  end

  it "has an associated survey" do
    expect(@response.survey).to eq(@survey)
  end

  it "encrypts the email" do
    expect(@response.encrypted_attribute?(:email)).to be_truthy
  end

  it "encrypts the responses" do
    expect(@response.encrypted_attribute?(:responses)).to be_truthy
  end

  it "deserialized responses as an array of hashes" do
    expect(@response.responses).to be_kind_of(Array)
    expect(@response.responses.first).to be_kind_of(Hash)
  end
end
