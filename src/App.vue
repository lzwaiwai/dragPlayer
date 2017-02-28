<style lang="less">
  @import './styles/app';
</style>

<template>
  <div class="container">
    <audio-player
      v-for="item in audios"
      :data.sync="item"
      :data-id="item.id"
      :key="item.id"
      class="msg-audio"
      @click="handdleAudio($event, item)"></audio-player>
  </div>
</template>

<script>
  import VoiceLive from 'voiceLive'
  import $ from 'npm-zepto'
  import array from 'lodash/array'
  import DragX from './dragX'
  import audios from './data'
  import audioPlayer from './components/audio'

  export default {
    data () {
      return {
        audios,
        curIndex: -1,
        curAudio: null,
        curPlayer: null,
        isPlaying: false,
        isSeeking: false,
        howls: null
      }
    },

    components: {
      audioPlayer
    },

    ready () {
      const that = this

      that.howls = new VoiceLive({
        datas: that.audios,
        step: function (itemId, currentTime, progress) {
          progress = (progress * 100).toFixed(2)
          if (progress > 99) {
            progress = 100.00
          }
          that.curAudio.currentTime = Math.floor(currentTime)
          if (!that.isSeeking) {
            $('.schedule.active').css('width', progress + '%')
          }
        },
        events: {
          onload: function () {
            console.log('onload')
          },
          onloaderror: function () {
            console.log('onloaderror')
          },
          onplay: function () {
            $(that.curPlayer).find('.schedule').addClass('active')
            that.curAudio.playing = -1
            that.curAudio.playing = 1
            that.isPlaying = true
            console.log('onplay')
          },
          onpause: function () {
            $(that.curPlayer).find('.schedule').removeClass('active')
            that.curAudio.playing = 0
            that.isPlaying = false
            console.log('onpause')
          },
          onstop: function () {
            that.isPlaying = false
            console.log('onstop')
          },
          onend: function () {
            if (that.isSeeking) {
              that.curAudio.playing = 0
              that.isPlaying = false
              return
            }
            // 重置刚播放完的播放器的状态
            that.curAudio.playing = 0
            $('.schedule.active').css('width', 0)
            $(that.curPlayer).find('.schedule').removeClass('active')

            const nextIndex = that.curIndex + 1
            if (!that.audios[nextIndex]) {
              return
            }

            // 修改当前播放数据和播放器 dom
            that.isPlaying = false
            that.curIndex = nextIndex
            that.curAudio = that.audios[nextIndex]
            that.curPlayer = $(that.curPlayer).next('.audio-plug.msg-audio')

            this.playNext() // for auto play next item
            console.log('onend')
          }
        }
      })

      DragX('.schedule.active .playing-point', {
        startDrag: (ele) => {
          this.isSeeking = true
        },
        onDrag: (ele, percent) => {
          var duration = $(ele).attr('data-duration')
          $(ele).attr('data-hint', (percent * duration).toFixed(1) + '″')
        },
        endDrag: (ele, percent) => {
          var duration = $(ele).attr('data-duration')
          this.isSeeking = false
          this.howls.seek(this.curAudio.id, (percent * duration).toFixed(0))
        }
      })
    },

    methods: { // playing 0：未播放，1：正在播放，-1：正在加载
      _play (audio) {
        this.curAudio.playing = -1
        this.howls.play(audio.id)
      },
      _pause (audio) {
        this.howls.pause(audio.id)
      },
      _findIndexFromId (id) {
        return array.findIndex(this.audios, (o) => {
          return o.id === id
        })
      },
      handdleAudio (e, audio) {
        const target = $(e.target)

        if (!target.hasClass('control-btn')) {
          return
        }

        const parent = target.parents('.audio-plug')
        const curIndex = this._findIndexFromId(audio.id)
        const isPlayBtn = target.hasClass('control-btn')

        if (this.curPlayer) {
          $(this.curPlayer).find('.schedule').removeClass('active')
        }

        if (this.curAudio) {
          this.curAudio.playing = 0
          this.isPlaying = false
        }

        this.curIndex = curIndex
        this.curAudio = audio
        this.curPlayer = parent

        if (isPlayBtn) {
          target.hasClass('play') ? this._play(audio) : this._pause(audio)
        }
      }
    }
  }
</script>
