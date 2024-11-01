require 'rails_helper'

RSpec.describe "Api::V1::SurveyResponses", type: :request do
  fixtures :surveys

  describe "POST /create" do
    it "creates a survey response" do
      survey = surveys(:survey_one)
      response_email = "test@example.com"
      post api_v1_survey_survey_responses_path(survey.id), params: { survey_response: {
        email: response_email,
        responses:
          survey.questions.map do |q|
            { question_id: q["id"], value: q["type"] == "text" ? "text" : 1 }
          end
      } }, as: :json
      expect(response).to have_http_status(:success)
      response = SurveyResponse.first
      expect(response.survey).to eq(survey)
      expect(response.email).to eq(response_email)
      expect(response.responses.length).to eq(survey.questions.length)
    end

    it "returns a 400 bad request with incomplete parameters" do
      survey = surveys(:survey_one)
      post api_v1_survey_survey_responses_path(survey.id), params: { survey_response: {
        responses: survey.questions.map do |q|
          { question_id: q["id"], value: q["type"] == "text" ? "text" : 1 }
        end
      } }, as: :json
      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)["error"]).to eq("RecordInvalid")
    end
  end
end
