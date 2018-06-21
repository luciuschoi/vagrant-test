class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    can [:edit, :update, :destroy], Comment, user_id: user.id
    can [ :read, :show, :create, :reply], Comment
  end
end