# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).on "click", '.cancel-comment-link', (e) ->
  e.preventDefault()
  replied = $(this).data('reply')
  # console.log replied
  $comment = $(this).closest('.comment')
  # console.log $comment
  $form = $(this).closest('form')
  $restore_link = $comment.find('a.delete-comment-link')[0]
  if replied is true
    $reply_link = $comment.find('a.reply-comment-link')[0]
    # console.log $reply_link
    $reply_link.href = "#{$restore_link.href}/reply"
  $edit_link = $comment.find('a.edit-comment-link')[0]
  # console.log $edit_link
  $edit_link.href = "#{$restore_link.href}/edit"
  $form.remove()

$(document).on 'keyup', '.comment_content textarea', (e) ->
  comment_id = $(this).data('comment-id')
  counter = $("#comment_#{comment_id}_chars_counter")
  charsRemaining = 255 - ($(this).val().length)
  counter.text "Remaining : #{charsRemaining}"
  counter.css 'color', if charsRemaining < 0 then 'red' else '#818a91'
  return

# Handle 401 error on ajax call.
$(document).ajaxError (_, xhr)->
  window.location = '/users/sign_in' if xhr.status == 401
