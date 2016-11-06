class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, as: :commentable, dependent: :destroy

  validates :content, presence: true
end
