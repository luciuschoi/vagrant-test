App.comments = App.cable.subscriptions.create('CommentsChannel', {
  collection: function () {
    return $("[data-channel='comments']");
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
      return this.collection().append(data.comment);
    }
  },

  userIsCurrentUser: function (comment) {
    return $(comment).attr('data-user-id') === $('meta[name=current-user]').attr('id');
  },

  disconnected: function () {},

  followCurrentPost: function () {
    var commentableId;
    commentableId = this.collection();
    if (commentableId = this.collection().data('commentable-id')) {
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