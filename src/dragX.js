/* eslint-disable */
import $ from 'npm-zepto'

var doc = document,
  bodyScroll = function (e) { // 禁止底部页面滚动
    e.preventDefault()
  },
  forbidScroll = function () {
    doc.addEventListener('touchmove', bodyScroll, false)
  },
  removeForbidScroll = function () {
    doc.removeEventListener('touchmove', bodyScroll, false)
  }

var dragX = function (ele, drags) {
  var doc = document,
    startX = 0,
    percent = 0

  var start = function (e) {
    var target = $(e.currentTarget),
      tStart = e.targetTouches ? e.targetTouches[0].pageX : e.pageX

    startX = parseFloat(tStart) - parseFloat(target.parent('.schedule').width())
    target.addClass('active')
    forbidScroll()
    drags.startDrag && drags.startDrag()
  },
  move = function(e) {
    var target = $(e.currentTarget),
      parent = target.parents('.play-bar'),
      pWidth = parseFloat($(parent).css('width')),
      tMove = e.targetTouches ? e.targetTouches[0].pageX : e.pageX,
      moveX = parseFloat(tMove) - startX

    if (moveX > parseFloat(pWidth) || moveX < 0) {
      return
    }

    target.parent('.schedule').css('width', moveX)

    percent = moveX / (pWidth)
    drags.onDrag && drags.onDrag(target[0], percent)
  },
  end = function(e) {
    var target = $(e.currentTarget)
    target.removeClass('active')
    removeForbidScroll()
    drags.endDrag && drags.endDrag(target[0], percent)
  }

  $(doc).on('touchstart', ele, start)
  $(doc).on('touchmove', ele, move)
  $(doc).on('touchend', ele, end)

  $(doc).on('mousedown', ele, start)
  $(doc).on('mousemove.drag', ele, move)
  $(doc).on('mouseup', ele, end)
}

export default dragX
// usage:
// dragX('.drag-x', function (ele, percent) {
//   var duration = $(ele).attr('data-duration')
//   $(ele).attr('data-hint', (percent * duration).toFixed(1) + '\'\'')
// })
/* eslint-disable */
