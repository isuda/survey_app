# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Survey.find_or_create_by!(name: "Mental Health Survey", questions: [
  { id: 1, type: "scale", title: "How are you feeling today?", min: 1, max: 3 },
  { id: 2, type: "scale", title: "Rate your stress level from 1-5", min: 1, max: 5 },
  { id: 3, type: "text",  title: "Any additional comments?", limit: 255 }
])

# Create some fake responses. Normally this wouldn't be in seeds.
# SurveyResponse.create!(
#    email: "test1@example.com",
#    survey: survey,
#    responses: [
#      { question: survey.questions[0], response: { value: 2 } },
#      { question: survey.questions[1], response: { value: 5 } },
#      { question: survey.questions[2], response: { value: "Sample Comment" } }
#    ]
#  )

#  SurveyResponse.create!(
#    email: "test2@example.com",
#    survey: survey,
#    responses: [
#      { question: survey.questions[0], response: { value: 1 } },
#      { question: survey.questions[1], response: { value: 3 } },
#      { question: survey.questions[2], response: { value: "Sample Comment2" } }
#    ]
#  )
