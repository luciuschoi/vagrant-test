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
      // when a comment is updated,
      if (data.comment_action == 'update') {
        console.log('updated successfully');
        return $("#comment_" + data.comment_id).html(data.comment).find('li').last().effect("highlight", {}, 1000);
      }
      // when a comment is destroyed,
      if (data.comment_action == 'destroy') {
        console.log('deleted successfully');
        $parent_comment = $("#comment_" + data.parent_id);
        $parent_comment_user_id = $parent_comment.data('user-id');
        if (this.userIsCurrentUser($parent_comment)) {
          // added edit and destroy link
          $edit_link = document.createElement('a');
          $edit_link.setAttribute('href', "/" + data.commentable_type + "/" + data.commentable_id + "/comments/" + data.parent_id + "/edit");
          $edit_link.setAttribute('class', 'edit-comment-link');
          $edit_link.setAttribute('data-remote', true);
          $edit_link.innerHTML = 'Edit';
          $new_dot_span_for_edit = document.createElement('span');
          $new_dot_span_for_edit.className = 'dot-bullet ml-1';
          $new_dot_span_for_edit.appendChild($edit_link);
          $delete_link = document.createElement('a');
          $delete_link.setAttribute('href', "/" + data.commentable_type + "/" + data.commentable_id + "/comments/" + data.parent_id);
          $delete_link.setAttribute('class', 'delete-comment-link');
          $delete_link.setAttribute('data-remote', true);
          $delete_link.setAttribute('data-confirm', 'Are you sure?');
          $delete_link.setAttribute('data-method', "delete");
          $delete_link.setAttribute('rel', "nofollow");
          $delete_link.innerHTML = 'Destroy';
          $new_dot_span_for_delete = document.createElement('span');
          $new_dot_span_for_delete.className = 'dot-bullet ml-1';
          $new_dot_span_for_delete.appendChild($delete_link);
          $("#comment_" + data.parent_id + " .comment-info small .dot-bullet")[0].after($new_dot_span_for_edit, $new_dot_span_for_delete);
        }
        $comments_count = $("#comments-count-of-commentable-" + data.commentable_id);
        $comments_count.html(data.commentable_comments_size).effect('highlight', {}, 1000);
        return $("#comment_" + data.comment_id).effect("highlight", {
          color: '#f7937c'
        }, 500).slideUp('fast');
      }
    }
    // when a comment is created,
    if (data.comment_action == 'create') {
      console.log('created successfully');
      $comments_count = $("#comments-count-of-commentable-" + data.commentable_id);
      $comments_count.html(data.commentable_comments_size).effect('highlight', {}, 1000);
      this.collection(data.parent_id).append(data.comment);
      $parent_comment = $("#comment_" + data.parent_id);
      $parent_comment_user_id = $parent_comment.data('user-id');
      if (this.userIsCurrentUser($parent_comment)) {
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