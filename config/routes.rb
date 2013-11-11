Whoa::Application.routes.draw do
 
  root 'sessions#new'

  resources :users

  resource :session

end