Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api, defaults: { format: "json" } do
    namespace :v1 do
      resources :surveys, only: [ :index, :show ] do
        resources :survey_responses, only: [ :create ]
      end
    end
  end

  # Defines the root path route ("/")
  get "/*path", to: "app#index"
  root "app#index"
end
