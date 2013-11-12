Whoa::Application.routes.draw do

  resources :questions do
    member do
      post :vote_up
    end

    member do
      post 'mark_answered'
    end
  end
 
  root 'welcome#index'

  #resources :questions
  
  resources :users

  resource :session

  resource :welcome, only: [:index]

  resources :votes


end