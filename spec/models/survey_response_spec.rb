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

  describe "validations" do
    it "must have an associated survey" do
      survey_resp = SurveyResponse.new(survey_id: -1, email: "test@example.com", responses: [])
      expect(survey_resp.valid?).to be_falsy
      expect(survey_resp.errors.where(:survey, :blank).length).not_to eq(0)
    end

    it "must have an email" do
      survey = surveys(:survey_one)
      survey_resp = SurveyResponse.new(survey_id: survey.id, responses: [])
      expect(survey_resp.valid?).to be_falsy
      expect(survey_resp.errors.where(:email, :blank).length).not_to eq(0)
    end

    it "must have valid survey responses" do
      survey = surveys(:survey_one)
      survey_resp = SurveyResponse.new(survey_id: survey.id, email: "test@example.com", responses: [])
      expect(survey_resp.valid?).to be_falsy
      expect(survey_resp.errors.where(:responses).length).not_to eq(0)
    end

    it "response scale questions must be numeric" do
      survey = surveys(:survey_one)
      survey_resp = SurveyResponse.new(survey_id: survey.id, email: "test@example.com", responses: survey.questions.map{ |q|
        { question_id: q["id"], value: "string" }
      })
      expect(survey_resp.valid?).to be_falsy
      expect(survey_resp.errors.where(:responses, "Bad question response value. Expected Numeric and got String").length).not_to eq(0)
    end

    it "response text questions must be String" do
      survey = surveys(:survey_one)
      survey_resp = SurveyResponse.new(survey_id: survey.id, email: "test@example.com", responses: survey.questions.map{ |q|
        { question_id: q["id"], value: 1 }
      })
      expect(survey_resp.valid?).to be_falsy
      expect(survey_resp.errors.where(:responses, "Bad question response value. Expected String and got Integer").length).not_to eq(0)
    end
  end
end
