<template>
  <div class="audio-plug">
    <div class="audio-con">
      <span class="control-btn" :class="{'play': data.playing === 0, 'loading': data.playing === -1, 'pause': data.playing === 1}"></span>
      <div class="play-bar">
        <div class="schedule"><div class="playing-point hint--top dragx" data-hint="0″" :data-duration="data.time"><i class="playing-status"></i></div></div>
      </div>
      <span class="time">{{ data.playing === 1 ? data.currentTime.toFixed(0) : data.time }}″</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>
