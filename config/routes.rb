Whoa::Application.routes.draw do
 
  root 'welcome#index'


  resources :questions
  
  resources :users

  resource :session

<<<<<<< HEAD

=======
>>>>>>> 36ade49e1384d6a9ae45d6023af90df02720c54f
  resource :welcome, only: [:index]

end