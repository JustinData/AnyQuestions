Whoa::Application.routes.draw do
 
  root 'welcome#index'


  resources :questions
  
  resources :users

  resource :session


  resource :welcome, only: [:index]

end