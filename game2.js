class Block {
	constructor(x, y, grid) {
		this.x = x;
		this.y = y;
		this.parentGrid = grid;
		this.div = elt('div');
		this.setNum('empty');
		this.eventListeners();
	}
	getAdjacent() {
		// so cumbersome...
		this.adjacents = [this];
		if(this.parentGrid.grid[this.x][this.y - 1]) {
			this.adjacents.push(this.parentGrid.grid[this.x][this.y - 1]);
		}
		if(this.parentGrid.grid[this.x][this.y + 1]) {
			this.adjacents.push(this.parentGrid.grid[this.x][this.y + 1]);
		}
		if(this.parentGrid.grid[this.x - 1]) {
			this.adjacents.push(this.parentGrid.grid[this.x - 1][this.y]);
			if(this.parentGrid.grid[this.x - 1][this.y - 1]) {
				this.adjacents.push(this.parentGrid.grid[this.x - 1][this.y - 1]);
			}
			if(this.parentGrid.grid[this.x - 1][this.y + 1]) {
				this.adjacents.push(this.parentGrid.grid[this.x - 1][this.y + 1]);
			}
		}
		if(this.parentGrid.grid[this.x + 1]) {
			this.adjacents.push(this.parentGrid.grid[this.x + 1][this.y]);
			if(this.parentGrid.grid[this.x + 1][this.y - 1]) {
				this.adjacents.push(this.parentGrid.grid[this.x + 1][this.y - 1]);
			}
			if(this.parentGrid.grid[this.x + 1][this.y + 1]) {
				this.adjacents.push(this.parentGrid.grid[this.x + 1][this.y + 1]);
			}
		}
	}
	eventListeners() {
		this.div.addEventListener('mouseover', e => {
			if(this.empty) {
				this.setNum(this.parentGrid.numbers[0], true);
				this.parentGrid.updateScreen();
			}
		});
		this.div.addEventListener('mouseout', e => {
			if(this.hover) {
				this.setNum('empty');
				this.parentGrid.updateScreen();
			}
		});
		this.div.addEventListener('click', e => {
			if(this.hover) {
				this.setNum(this.parentGrid.numbers[0]);
				let sum = this.calculateSum();
				if(sum % 10 == 0) {
					for(let z = 0; z < this.adjacents.length; z++) {
						this.adjacents[z].setNum('empty');
					}
				}
				this.parentGrid.nextNumber();
				this.parentGrid.updateScreen();
			}
		});
	}
	calculateSum() {
		let sum = 0;
		for(let z = 0; z < this.adjacents.length; z++) {
			sum += parseInt(this.adjacents[z].num) || 0;
		}
		return sum;
	}
	setNum(n, hover) {
		this.num = n;
		this.empty = n == 'empty';
		this.hover = hover;
	}
}

class Game {
	constructor(grid, range, colors) {
		// grid: array -
		// 	[width (usu. 10, is a square),
		// 	padding (usu. 1), how much space is empty]
		// range: array [min number (usu. 0), max number (usu. 9)]
		// colors: object (or array), length must match grid.width
		this.width = grid[0];
		this.pad = grid[1]
		this.min = range[0];
		this.max = range[1];
		this.numbers = [random(this.min, this.max), random(this.min, this.max)];
		this.grid = [];
		this.gridDiv = document.getElementById('grid');
		this.colors = colors;
	}
	addBlocks() {
		for(let y = 0; y < this.width; y++) {
			this.grid.push([]);
			for(let x = 0; x < this.width; x++) {
				this.grid[y].push(new Block(y, x, this));
			}
		}
	}
	gridInit() {
		for(let y = this.pad; y < this.width - this.pad; y++) {
			for(let x = this.pad; x < this.width - this.pad; x++) {
				this.grid[x][y].setNum(random(this.min, this.max));
			}
		}
		for(let y = 0; y < this.width; y++) {
			for(let x = 0; x < this.width; x++) {
				this.grid[x][y].getAdjacent();
			}
		}
	}
	addGrid() {
		this.gridDiv.style.gridTemplate = `repeat(${this.width}, 1fr) / repeat(${this.width}, 1fr)`;
		for(let y = 0; y < this.width; y++) {
			for(let x = 0; x < this.width; x++) {
				this.gridDiv.appendChild(this.grid[x][y].div);
			}
		}
		// for(let y = 0; y < this.width; y++) {
		// 	let tr = elt('tr');
		// 	this.gridDiv.appendChild(tr);
		// 	for(let x = 0; x < this.width; x++) {
		// 		tr.appendChild(this.grid[x][y].div);
		// 	}
		// }
	}
	nextNumber() {
		this.numbers[0] = this.numbers[1]; // next is now current
		this.numbers[1] = random(this.min, this.max); // random replace next
	}
	updateScreen() {
		// grid
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.width; y++) {
				let block = this.grid[x][y];
				block.div.className = '';
				if(block.empty) {
					block.div.classList.add('empty');
					block.div.innerHTML = '';
				} else {
					block.div.classList.add(this.colors[block.num]);
					block.div.innerHTML = block.num;
				}
				if(block.hover) {
					block.div.classList.add('hover');
					document.getElementById('cheat').innerText = block.calculateSum();
				}
			}
		}
		// nums
		let curr = document.getElementById('curr');
		curr.className = 'num';
		curr.classList.add(this.colors[curr.innerHTML = this.numbers[0]]);
		let next = document.getElementById('next');
		next.className = 'num';
		next.classList.add(this.colors[next.innerHTML = this.numbers[1]]);
		this.checkWin();
	}
	checkWin() {
		let hasEmpty, hasFilled;
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.width; y++) {
				if(this.grid[x][y].empty || this.grid[x][y].hover)
					hasEmpty = true;
				if(!this.grid[x][y].empty && !this.grid[x][y].hover)
					hasFilled = true;
			}
		}
		if(!hasEmpty) {
			if(confirm("Boo hoo, you lost the game! Refresh to start another one."))
				window.location.reload();
		}
		if(!hasFilled) {
			if(confirm("Hooray! You have won the game! Start another one?"))
				window.location.reload();
		}
	}
	startGame() {
		this.addBlocks();
		this.gridInit();
		this.addGrid();
		this.nextNumber();
		this.updateScreen();
	}
}

let game = new Game([10, 1], [0, 9], ['cffebc6', 'c00202e', 'c003f5c', 'c2c4875', 'c8a508f', 'cbc5090', 'cff6361', 'cff8531', 'cffa600', 'cffd380']);
game.startGame();

function random(min,max){return Math.round(Math.random()*(max-min)+min);}
function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}