<template>
  <div class="music-player">
    <button @click="togglePlay" class="music-button" :title="isPlaying ? '暂停音乐' : '播放音乐'">
      <i class="bi" :class="isPlaying ? 'bi-pause-circle' : 'bi-play-circle'"></i>
    </button>
    <div v-if="isPlaying" class="track-info">
      <span>当前播放: {{ currentTrack.name }}</span>
    </div>
    <audio ref="audioPlayer" @ended="playNextTrack"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

// 音频播放器引用
const audioPlayer = ref(null);
const isPlaying = ref(false);

// 音乐曲目列表 - 使用相对路径
const tracks = reactive([
  { src: new URL('../assets/music/Flower Dance.flac', import.meta.url).href, name: 'Flower Dance' },
  { src: new URL('../assets/music/Mirage.flac', import.meta.url).href, name: 'Mirage' },
  { src: new URL('../assets/music/Nightfall.flac', import.meta.url).href, name: 'Nightfall' }
]);

// 当前曲目索引
const currentTrackIndex = ref(0);
const currentTrack = reactive(tracks[0]);

// 切换播放/暂停
const togglePlay = () => {
  if (!audioPlayer.value) return;
  
  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play().catch(error => {
      console.error('播放音乐失败:', error);
      // 如果自动播放失败，这里可以显示一些用户交互提示
    });
  }
  
  isPlaying.value = !isPlaying.value;
};

// 播放下一曲
const playNextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
  loadAndPlayTrack(tracks[currentTrackIndex.value]);
};

// 加载并播放曲目
const loadAndPlayTrack = (track) => {
  if (!audioPlayer.value) return;
  
  // 更新当前曲目
  Object.assign(currentTrack, track);
  
  // 设置音频源
  audioPlayer.value.src = track.src;
  audioPlayer.value.load();
  
  // 播放音频
  if (isPlaying.value) {
    audioPlayer.value.play().catch(error => {
      console.error('播放音乐失败:', error);
      isPlaying.value = false;
    });
  }
};

// 组件挂载时初始化音频播放器
onMounted(() => {
  if (audioPlayer.value) {
    loadAndPlayTrack(tracks[currentTrackIndex.value]);
  }
});
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 15px;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.music-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.8rem;
  color: #0d6efd;
  padding: 0;
  margin-right: 10px;
}

.track-info {
  font-size: 0.9rem;
  color: #6c757d;
}

@media (max-width: 576px) {
  .music-player {
    bottom: 10px;
    left: 10px;
    padding: 5px 10px;
  }
  
  .music-button {
    font-size: 1.5rem;
  }
  
  .track-info {
    display: none;
  }
}
</style>
