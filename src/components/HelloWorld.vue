<template>
  <div>
    <div class="radio-container">
      <div class="row">
        <input type="radio" id="easy" name="level" value="1" v-model="level">
        <label for="easy">简单(每张表16空)</label>

        <input type="radio" id="normal" name="level" value="2" v-model="level">
        <label for="normal">普通（每张表25空）</label>
      </div>

      <div class="row">
        <input type="radio" id="hard" name="level" value="3" v-model="level">
        <label for="hard">困难（每张表36空）</label>

        <input type="radio" id="very-hard" name="level" value="4" v-model="level">
        <label for="very-hard">非常困难（每张表49空）</label>
      </div>
    </div>

    <div class="start-button">
      <button @click="startGame">
        <span class="start-icon">&nbsp;&nbsp;&nbsp; </span>
        游戏开始
      </button>
    </div>

    <div class="game-rules-container">
      <div class="game-rules-title-box">
        <h2 class="game-rules-title">游戏规则</h2>
      </div>
      <div class="game-rules-content-box">
        <div class="game-rules-content">
          每一张九宫格棋盘是一个9x9的格网，被划分成3x3个区域，每个区域是一块九宫格。 玩家需要在格内填入1到9的数字，其中一些数字在游戏开始时已经给出。 每一行，每一列，以及每一块九宫格区域内的数字必须是唯一的，不允许出现重复。
          游戏会并发生成九张九宫格表，玩家可以使用下拉框的形式选择填入其中的数字，如果填入所有的答案并且正确则游戏成功，否则如果有一个空格无法继续填入内容则游戏失败。<br>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      level: '',
      isStarted: false
    }
  },
  methods: {
    startGame() {
      if (this.level === '') {
        alert('请选择游戏难度');
        return;
      }
      this.isStarted = true;
      this.$router.push({ path: '/game', query: { level: this.level } });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.radio-container {
  display: block;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 3px solid #000;
  border-radius: 10px;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
}

.radio-container input[type="radio"] {
  margin-right: 10px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}


.radio-container label {
  margin-right: 20px;
  font-family: "微软雅黑", sans-serif;
  font-weight: bold;
}

.start-button button {
  align-items: center;
  width: 250px;
  height: 60px;
  border: 3px solid #000;
  background-color: #1eff00;
  border-radius: 30px;
  margin-top: 25px;
  padding: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-size: 24px;
}

.start-icon {
  width: 20px;
  height: 20px;
  background-image: url("../assets/开始.png");
  background-size: cover;
  margin-right: 5px;
}

.game-rules-container {
  display: block;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 10px;
  margin-top: 20px;
  box-sizing: border-box;

}

.game-rules-title-box {
  padding: 10px;
  border: 3px solid #000;
  background-color: #f9f9f9;
  opacity: 0.7;
  border-radius: 10px;
  margin-bottom: 10px;
}

.game-rules-title {
  color: orange;
  font-size: 24px;
  margin: 0;
}

.game-rules-content-box {
  background-color: #f9f9f9;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 10px;
  opacity: 0.7;
}

.game-rules-content {
  font-family: "微软雅黑", sans-serif;
  font-size: 20px;

}
</style>
