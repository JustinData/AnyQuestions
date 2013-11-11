Whoa::Application.routes.draw do
 
  root 'welcome#index'

  #root 'questions#index' erica's root

  resources :questions
  
  resources :users

  resource :session

  resource :welcome, only: [:index]

end