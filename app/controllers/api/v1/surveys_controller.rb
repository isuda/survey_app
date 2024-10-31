module Api::V1
  class SurveysController < ApiController
    def index
      surveys = Survey.all
      render json: surveys
    end

    def show
      survey = Survey.find(params[:id])
      render json: survey
    rescue ActiveRecord::RecordNotFound
      render json: {
        error: "RecordNotFound",
        message: "Survey #{params[:id]} not found"
      }, status: :not_found
    end
  end
end
