<template>
    <div style="display: inline;">
        <div class="time-display">当前经过时间：{{ elapsedTime }}</div>
        <div class="new-game-box">
            <div class="title">新游戏</div>
            <div class="level-buttons">
                <button class="level-button" @click="confirmAction(changeLevel, 1)">简单</button>
                <button class="level-button" @click="confirmAction(changeLevel, 2)">普通</button>
                <button class="level-button" @click="confirmAction(changeLevel, 3)">困难</button>
                <button class="level-button" @click="confirmAction(changeLevel, 4)">非常困难</button>
            </div>
        </div>
        <div class="action-buttons">
            <button class="action-button" @click="confirmAction(showAnswer)">显示答案</button>
            <button class="action-button" @click="confirmAction(restartlevel)">清空填入</button>
            <button class="action-button" @click="confirmAction(newlevel)">新游戏</button>
            <button class="action-button" @click="confirmAction(returnMyPage)">返回主页面</button>
        </div>
    </div>

    <div class="container">
<!-- 使用vue模板语言遍历生成表格 -->
        <div v-for="(sudokuGrid, gridIndex) in sudokuGrids" :key="gridIndex" class="sudoku">
            <div v-for="(row, rowIndex) in sudokuGrid" :key="rowIndex" class="row"
                :class="{ 'bold-row': rowIndex % 3 === 0 }">
                <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                    :class="{ 'bold-cell': colIndex % 3 === 0, 'red-cell': isRed(gridIndex, rowIndex, colIndex) }">
                    <template v-if="cell === 0">
                        <select v-model="sudokuGrids[gridIndex][rowIndex][colIndex]" class="select-box"
                            @change="checkGameStatus">
                            <option v-for="(option, index) in getAvailableOptions(gridIndex, rowIndex, colIndex)"
                                :value="option" :key="index">
                                {{ option }}</option>
                        </select>

                    </template>
                    <template v-else>
                        {{ cell }}
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            level: 1,//初始值设为1
            sudokuGrids: [],//用户保存供玩家游玩的数独
            sudokuGrids_copy: [],//备份一个数组用于重新开始游戏
            sudoAnswer: [],//用户保存数独答案
            redCells: [],//用户保存数独答案的显示位置
            startTime: null,
            elapsedTime: 0
        };
    },
    created() {
        this.level = this.$route.query.level || 1;
        this.fetchSudokuData();//初始化时取得游戏数据
        this.startTime = Date.now();
        setInterval(() => {
            this.elapsedTime = this.elapsedTime_method(); // 更新elapsedTime属性
        }, 1000);

    },
    methods: {
        // 游戏状态检查，每填入一个空都会检查状态，判断游戏是否完成与游戏是否失败
        checkGameStatus() {
            let gameComplete = true;
            let gameSuccess = true;
            for (let i = 0; i < this.sudokuGrids.length; i++) {
                const sudokuGrid = this.sudokuGrids[i];
                for (let j = 0; j < sudokuGrid.length; j++) {
                    const row = sudokuGrid[j];
                    for (let k = 0; k < row.length; k++) {
                        const cell = row[k];
                        if (cell === 0) {
                            gameComplete = false;
                            if (!this.isValidMove(i, j, k)) {
                                gameSuccess = false;
                                break;
                            }
                        }
                    }
                    if (!gameSuccess) {
                        break;
                    }
                }
                if (!gameSuccess) {
                    break;
                }
            }
            if (gameComplete && gameSuccess) {
                alert('游戏成功！');
            } else if (!gameSuccess) {
                alert('游戏失败！');
            }
        },
        // 判断游戏是否失败，是否有空格被判断无法填入任何数字
        isValidMove(gridIndex, rowIndex, colIndex) {
            const availableOptions = this.getAvailableOptions(gridIndex, rowIndex, colIndex);
            if (availableOptions.length === 0) {
                return false;
            }
            return true;
        },
        // 根据数独的游戏的规则获取空格能填入的数字
        getAvailableOptions(gridIndex, rowIndex, colIndex) {
            const row = this.sudokuGrids[gridIndex][rowIndex];
            const column = this.getColumn(colIndex);
            const grid = this.getGrid(gridIndex, rowIndex, colIndex);
            const usedNumbers = [...row, ...column, ...grid];
            const availableOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !usedNumbers.includes(num));
            return availableOptions;
        },
        getColumn(colIndex) {
            const column = [];
            for (let i = 0; i < this.sudokuGrids.length; i++) {
                const row = this.sudokuGrids[i];
                column.push(row[colIndex]);
            }
            return column;
        },
        getGrid(gridIndex, rowIndex, colIndex) {
            const grid = [];
            const startRow = Math.floor(rowIndex / 3) * 3;
            const startCol = Math.floor(colIndex / 3) * 3;
            for (let i = startRow; i < startRow + 3; i++) {
                const row = this.sudokuGrids[gridIndex][i];
                for (let j = startCol; j < startCol + 3; j++) {
                    grid.push(row[j]);
                }
            }
            return grid;
        },
        // web提醒，提醒玩家是否执行相关按钮操作，玩家选择“确定”才会执行相关操作
        confirmAction(handler, ...args) {
            if (window.confirm('确定要执行此操作吗？')) {
                handler(...args);
            }
        },
        // 重新开始当前游戏，重新初始化显示的图表
        restartlevel() {
            this.redCells=[];
            this.sudokuGrids = JSON.parse(JSON.stringify(this.sudokuGrids_copy));
        },
        // 根据玩家的选择重新开始不同难度的新游戏
        changeLevel(level) {
            this.level = level;
            this.redCells = []; //清空redcells
            this.sudokuGrids = []; // 清空sudokuGrids数组
            this.sudoAnswer = []; // 清空sudoAnswer数组
            this.sudokuGrids_copy = [];
            this.fetchSudokuData();
        },
        // 往后台相应端口发送请求，获取数独游戏的数据，一共的九个对象，每个对象里面都有两张9*9的二维数组，一张是题目，一张是答案
        fetchSudokuData() {
            const data = {
                params: {
                    level: this.level
                }
            }
            axios.get('http://43.138.171.179:9000/sudoku', data).then((response) => { //相关端口获取数据
                this.sudoList = response.data.data;
                this.sudoList.forEach((obj) => {
                    this.sudokuGrids.push(obj.finalResult);
                    this.sudoAnswer.push(obj.result)
                });
                this.sudokuGrids_copy = JSON.parse(JSON.stringify(this.sudokuGrids)); // 将新获取的数独数据保存到sudokuGrids_copy数组中

            })

        },

        // 重新开始游戏，清空页面保存的列表，重新开始一个同样难度的新游戏
        newlevel() {
            this.startTime = Date.now(),
                this.redCells = []; //清空redcells
            this.sudokuGrids = []; // 清空sudokuGrids数组
            this.sudoAnswer = []; // 清空sudoAnswer数组
            this.sudokuGrids_copy = [];
            this.fetchSudokuData();
        },
        // 回到首页的定向导航
        returnMyPage() {
            this.$router.push({ path: '/' });

        },
        // 将相关的答案展示出来并在相应的位置标红
        showAnswer() {
            const redCells = [];
            for (let i = 0; i < this.sudokuGrids.length; i++) {
                const sudokuGrid = this.sudokuGrids_copy[i];
                for (let j = 0; j < sudokuGrid.length; j++) {
                    const row = sudokuGrid[j];
                    for (let k = 0; k < row.length; k++) {
                        const cell = row[k];
                        if (cell === 0) {
                            redCells.push({ gridIndex: i, rowIndex: j, colIndex: k });
                        }
                    }
                }
            }
            for (let i = 0; i < this.sudoAnswer.length; i++) {
                const sudokuGrid = this.sudoAnswer[i];
                for (let j = 0; j < sudokuGrid.length; j++) {
                    const row = sudokuGrid[j];
                    for (let k = 0; k < row.length; k++) {
                        const cell = row[k];
                        this.sudokuGrids[i][j][k] = cell === 0 ? '' : cell;
                    }
                }
            }
            console.log(redCells);
            this.redCells = redCells;
        },
        // 用于前端页面判断相应的位置是否标红
        isRed(gridIndex, rowIndex, colIndex) {
            return this.redCells.some(cell => cell.gridIndex === gridIndex && cell.rowIndex === rowIndex && cell.colIndex === colIndex);
        },
        // 用于定时调用获取显示的时间
        elapsedTime_method() {
            if (this.startTime) {
                const currentTime = Date.now();
                const timeDiff = currentTime - this.startTime;
                const minutes = Math.floor(timeDiff / 60000);
                const seconds = Math.floor((timeDiff % 60000) / 1000);
                return `${minutes}分钟${seconds}秒`;
            } else {
                return '';
            }
        }
    },

};
</script>
  
<style>
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #b2ffaf;
    opacity: 0.7;
    margin-top: 20px;

}

.new-game-box {
    /* margin-top: 500px; */
    width: 600px;
    height: 50px;
    margin: 10px;
    border: 2px solid #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: auto;
    justify-content: center;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-right: 10px;
    margin-left: 5px;
}

.level-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.level-button {
    align-items: center;
    width: 80px;
    height: 40px;
    border: 3px solid #000;
    background-color: #68edff;
    border-radius: 10px;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    margin-right: 20px;
}

.action-buttons {
    margin-top: 20px;
    width: 600px;
    height: 50px;
    margin: 10px;
    border: 2px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
}

.action-button {
    align-items: center;
    width: 100px;
    height: 40px;
    border: 3px solid #000;
    background-color: #0889ce;
    border-radius: 10px;
    padding: 5px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    margin-right: 20px;
}

.sudoku {
    width: 273px;
    margin: 10px;
    /* 添加外边距来创建间隔 */
    border: 2px solid #000;
    box-sizing: border-box;
}


.row {
    display: flex;
}

.cell {
    width: 30px;
    height: 30px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box
}


.bold-row {
    border-top: 2px solid #000;
}

.bold-cell {
    border-left: 2px solid #000;
}

.red-cell {
    color: red;
}

.select-box {
    width: 100%;
    height: 100%;
    border: 1px solid #000;
    padding: 5px;
    font-size: 14px;
    box-sizing: border-box;
}
</style>