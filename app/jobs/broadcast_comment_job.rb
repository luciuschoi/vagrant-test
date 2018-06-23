class BroadcastCommentJob < ApplicationJob
  before_perform :wardenize
  queue_as :default

  def perform(comment, comment_action)
    logger.info ">>>>>>>> perform action : #{comment_action}"
    if comment_action == 'destroy'
      ActionCable.server.broadcast "#{comment.commentable_id}:comments",
                                   comment_id: comment.id,
                                   parent_id: comment&.parent&.id,
                                   commentable_id: comment.commentable.id,
                                   commentable_comments_size: comment.commentable.comments.size,
                                   comment_action: comment_action
    else
      ActionCable.server.broadcast "#{comment.commentable_id}:comments",
                                 comment: render_comment(comment),
                                 comment_id: comment.id,
                                 parent_id: comment&.parent&.id,
                                 commentable_id: comment.commentable.id,
                                 commentable_comments_size: comment.commentable.comments.size,
                                 comment_action: comment_action
    end
  end

  private

  def render_comment(comment)
    @job_renderer.render partial: "comments/comment",
                         locals: { comment: comment, broadcasted: true }
  end

  def wardenize
    @job_renderer = ::ApplicationController.renderer.new
    renderer_env = @job_renderer.instance_eval { @env }
    warden = ::Warden::Proxy.new(renderer_env, ::Warden::Manager.new(Rails.application))
    renderer_env["warden"] = warden
  end
end
