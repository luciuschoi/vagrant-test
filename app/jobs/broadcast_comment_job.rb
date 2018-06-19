class BroadcastCommentJob < ApplicationJob
  queue_as :default

  def perform(comment)
    ActionCable.server.broadcast "#{comment.commentable_id}:comments",
    comment: render_comment(comment), parent_id: comment&.parent&.id
  end

  private

  def render_comment(comment)
    ApplicationController.render(partial: 'comments/comment', locals: { comment: comment } )
  end
end
