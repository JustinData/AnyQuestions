Whoa::Application.routes.draw do
 
  root 'sessions#new'

  #root 'questions#index' erica's root

  resources :questions
  
  resources :users

  resource :session

end