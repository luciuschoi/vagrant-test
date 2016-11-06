Rails.application.routes.draw do
  root "posts#index"
  resources :posts do
    resources :comments, except: [:index, :new, :show] do
      member do
        get :reply
      end
    end
  end
  devise_for :users

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
