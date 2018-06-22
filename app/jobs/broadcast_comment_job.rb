class BroadcastCommentJob < ApplicationJob
  before_perform :wardenize
  queue_as :default

  def perform(comment)
    ActionCable.server.broadcast "#{comment.commentable_id}:comments",
                                 comment: render_comment(comment),
                                 parent_id: comment&.parent&.id
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
