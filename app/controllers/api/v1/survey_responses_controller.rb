class Api::V1::SurveyResponsesController < ApplicationController
  def create
    SurveyResponse.create!(survey_response_params.merge(params.permit(:survey_id)))
  rescue ActiveRecord::RecordInvalid => err
    render json: {
      error: "RecordInvalid",
      message: err.message
    }, status: :unprocessable_content
  end

  private

  def survey_response_params
    params.require(:survey_response).permit(
      :email,
      responses: [ :question_id, :value ]
    )
  end
end
