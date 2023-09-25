<template>
    <div style="display: inline;">
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
            <button class="action-button" @click="confirmAction(restartlevel)">重新开始</button>
            <button class="action-button" @click="confirmAction(returnMyPage)">返回主页面</button>
        </div>
    </div>

    <div class="container">

        <div v-for="(sudokuGrid, gridIndex) in sudokuGrids" :key="gridIndex" class="sudoku">
            <div v-for="(row, rowIndex) in sudokuGrid" :key="rowIndex" class="row"
                :class="{ 'bold-row': rowIndex % 3 === 0 }">
                <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                    :class="{ 'bold-cell': colIndex % 3 === 0, 'red-cell': isRed(gridIndex, rowIndex, colIndex) }">
                    {{ cell === 0 ? '' : cell }}
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
            sudokuGrids: [],
            sudoAnswer: [],
            redCells: [],
        };
    },
    created() {
        this.level = this.$route.query.level || 1;
        this.fetchSudokuData();
    },
    // mounted() {
    //     const data = {
    //         params: {
    //             level: this.level
    //         }
    //     }
    //     axios.get('http://43.138.171.179:9000/sudoku', data).then((response) => {
    //         this.sudoList = response.data.data;
    //         this.sudoList.forEach((obj) => {
    //             this.sudokuGrids.push(obj.finalResult);
    //             this.sudoAnswer.push(obj.result)
    //         });
    //     })

    // }
    methods: {
        confirmAction(handler, ...args) {
            if (window.confirm('确定要执行此操作吗？')) {
                handler(...args);
            }
        },
        changeLevel(level) {
            this.level = level;
            this.redCells = []; //清空redcells
            this.sudokuGrids = []; // 清空sudokuGrids数组
            this.sudoAnswer = []; // 清空sudoAnswer数组
            this.fetchSudokuData();
        },
        fetchSudokuData() {
            const data = {
                params: {
                    level: this.level
                }
            }
            axios.get('http://43.138.171.179:9000/sudoku', data).then((response) => {
                this.sudoList = response.data.data;
                this.sudoList.forEach((obj) => {
                    this.sudokuGrids.push(obj.finalResult);
                    this.sudoAnswer.push(obj.result)
                });
            })
        },
        restartlevel() {
            this.redCells = []; //清空redcells
            this.sudokuGrids = []; // 清空sudokuGrids数组
            this.sudoAnswer = []; // 清空sudoAnswer数组
            this.fetchSudokuData();
        },
        returnMyPage() {
            this.$router.push({ path: '/' });

        },
        showAnswer() {
            const redCells = [];
            for (let i = 0; i < this.sudokuGrids.length; i++) {
                const sudokuGrid = this.sudokuGrids[i];
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
        isRed(gridIndex, rowIndex, colIndex) {
            return this.redCells.some(cell => cell.gridIndex === gridIndex && cell.rowIndex === rowIndex && cell.colIndex === colIndex);
        }
    }

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
</style>