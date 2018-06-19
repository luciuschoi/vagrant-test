App.comments = App.cable.subscriptions.create('CommentsChannel', {
  collection: function (parent_id) {
    if (parent_id) {
      // console.log("parent_id defined...." + parent_id)
      $comment_parent = $("[data-channel='comment-" + parent_id + "'] > ul");
      if(!$comment_parent.length){
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
    if (!this.userIsCurrentUser(data.comment)) {
      // console.log(data);
      return this.collection(data.parent_id).append(data.comment);
    }
  },

  userIsCurrentUser: function (comment) {
    return $(comment).attr('data-user-id') === $('meta[name=current-user]').attr('id');
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