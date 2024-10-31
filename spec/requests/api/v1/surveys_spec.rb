require 'rails_helper'

RSpec.describe "Api::V1::Surveys", type: :request do
  fixtures :surveys

  describe "GET /index" do
    it "returns a list of surveys" do
      get api_v1_surveys_path
      expect(response).to have_http_status(:success)
      expect(response.body).to eq(Survey.all.to_json)
    end
  end
  describe "GET /show" do
    it "returns a survey by id" do
      survey = surveys(:survey_one)
      get api_v1_survey_path(survey.id)
      expect(response).to have_http_status(:success)
      expect(response.body).to eq(survey.to_json)
    end

    it "returns a 404 with error json when not found" do
      get api_v1_survey_path("does-not-exist")
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("RecordNotFound")
    end
  end
end
