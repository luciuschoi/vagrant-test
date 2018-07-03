App.comments = App.cable.subscriptions.create('CommentsChannel', {
  collection: function (parent_id) {
    if (parent_id) {
      // console.log("parent_id defined...." + parent_id)
      $comment_parent = $("[data-channel='comment-" + parent_id + "'] > ul");
      if (!$comment_parent.length) {
        $("[data-channel='comment-" + parent_id + "']").append("<ul></ul>");
        $comment_parent = $("[data-channel='comment-" + parent_id + "'] > ul");
      }
      return $comment_parent;
    } else {
      // console.log("parent_id NOT defined....")
      return $("[data-channel='comments']");
    }
  },

  connected: function () {
    return setTimeout((function (_this) {
      return function () {
        return _this.followCurrentPost();
      };
    })(this), 1000);
  },

  received: function (data) {
    if (data.comment_action != 'destroy' && !this.userIsCurrentUser(data.comment)) {
      data.comment = data.comment.replace(/<span class='dot-bullet'><a class="(edit|delete)-comment-link"\s.*?>.*?<\/a><\/span>/g, '');
    } else {
      if (data.comment_action == 'update') {
        console.log('updated');
        return $("#comment_" + data.comment_id).html(data.comment).find('li').last().effect("highlight", {}, 1000);
      }
      if (data.comment_action == 'destroy') {
        console.log('deleted');
        $comments_count = $("#comments-count-of-commentable-" + data.commentable_id);
        $comments_count.html(data.commentable_comments_size).effect('highlight', {}, 1000);
        return $("#comment_" + data.comment_id).effect("highlight", {
          color: '#f7937c'
        }, 500).slideUp('fast');
      }
    }
    if (data.comment_action == 'create') {
      console.log('created');
      $comments_count = $("#comments-count-of-commentable-" + data.commentable_id);
      $comments_count.html(data.commentable_comments_size).effect('highlight', {}, 1000);
      this.collection(data.parent_id).append(data.comment);
      $parent_comment = $("#comment_" + data.parent_id);
      $parent_comment_user_id = $parent_comment.data('user-id');
      if (this.userIsCurrentUser(data.comment) && $parent_comment_user_id == data.user_id) {
        console.log("You should remove the edit and destroy link of parent comment");
        $parent_comment_info_action_group = $parent_comment.find(".comment-info small")[0];
        $parent_comment_info_action_group.innerHTML = $parent_comment_info_action_group.innerHTML.replace(/<span class="dot-bullet"><a class="(edit|delete)-comment-link"\s.*?>.*?<\/a><\/span>/g, '');
      }
      return
    }
  },

  userIsCurrentUser: function (comment) {
    return $(comment).attr('data-user-id') === $('meta[name=current-user]').attr('data-id');
  },

  disconnected: function () {},

  followCurrentPost: function () {
    var commentableId;
    commentableId = this.collection().data('commentable-id');
    if (commentableId) {
      return this.perform('follow', {
        commentable_id: commentableId
      });
    } else {
      return this.perform('unfollow');
    }
  },

  installPageChangeCallback: function () {
    if (!this.installedPageChangeCallback) {
      this.installedPageChangeCallback = true;
      return $(document).on('turbolinks:load', function () {
        return App.comments.followCurrentPost();
      });
    }
  }
});