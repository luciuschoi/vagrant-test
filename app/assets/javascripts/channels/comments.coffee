App.comments = App.cable.subscriptions.create('CommentsChannel',
  collection: ->
    $('[data-channel=\'comments\']')

  connected: ->
    setTimeout ((_this) ->
      ->
        _this.followCurrentPost()
    )(this), 1000

  disconnected: ->
  
  received: (data) ->
    if !@userIsCurrentUser(data.comment)
      return @collection().append(data.comment)
    return

  userIsCurrentUser: (comment) ->
    $(comment).attr('data-user-id') == $('meta[name=current-user]').attr('id')

  followCurrentPost: ->
    commentableId = undefined
    commentableId = @collection()
    if commentableId = @collection().data('commentable-id')
      @perform 'follow', commentable_id: commentableId
    else
      @perform 'unfollow'
      
  installPageChangeCallback: ->
    if !@installedPageChangeCallback
      @installedPageChangeCallback = true
      return $(document).on('turbolinks:load', ->
        App.comments.followCurrentPost()
      )
    return
)