const d = [10, 1];
let mousePos = [];
let numbers = [random(0, 9), random(0, 9)]; // current, next
class Block {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.div = elt('td');
		this.setNum(-1);
		// 3 most important listeners
		this.div.addEventListener('mouseover', e => {
			mousePos = [this.x, this.y];
			if(this.empty) {
				//color change
				this.getAdjacent();
				for(let z = 0; z < this.adjacents.length; z++) {
					this.adjacents[z].div.style.backgroundColor = '#ddd';
				}
				// number
				this.setNum(numbers[0], true);
				this.div.style.color = '#fff';
			}
		});
		this.div.addEventListener('mouseout', e => {
			// color change
			this.getAdjacent();
			for(let z = 0; z < this.adjacents.length; z++) {
				this.adjacents[z].div.style.backgroundColor = 'white';
			}
			// number
			if(this.empty) {
				this.setNum(-1);
				this.div.style.color = '#000';
			}
		});
		this.div.addEventListener('click', e => {
			if(this.empty) {
				// check if the sum is zero
				this.getAdjacent();
				let sum = 0;
				for(let z = 0; z < this.adjacents.length; z++) {
					// max(0, ...) is for when num = -1
					sum += Math.max(0, this.adjacents[z].num);
				}
				if(sum % 10 == 0) {
					for(let z = 0; z < this.adjacents.length; z++) {
						this.adjacents[z].setNum(-1);
					}
				} else {
					this.setNum(numbers[0]);
					this.div.style.color = '#000';
				}
				nextNumber();
			}
		});
	}
	getAdjacent() {
		this.adjacents = [this];
		if(grid[this.x][this.y - 1]) {
			this.adjacents.push(grid[this.x][this.y - 1]);
		}
		if(grid[this.x][this.y + 1]) {
			this.adjacents.push(grid[this.x][this.y + 1]);
		}
		if(grid[this.x - 1]) {
			this.adjacents.push(grid[this.x - 1][this.y]);
			if(grid[this.x - 1][this.y - 1]) {
				this.adjacents.push(grid[this.x - 1][this.y - 1]);
			}
			if(grid[this.x - 1][this.y + 1]) {
				this.adjacents.push(grid[this.x - 1][this.y + 1]);
			}
		}
		if(grid[this.x + 1]) {
			this.adjacents.push(grid[this.x + 1][this.y]);
			if(grid[this.x + 1][this.y - 1]) {
				this.adjacents.push(grid[this.x + 1][this.y - 1]);
			}
			if(grid[this.x + 1][this.y + 1]) {
				this.adjacents.push(grid[this.x + 1][this.y + 1]);
			}
		}
	}
	setNum(num, em) {
		// em stands for empty, is a last resort if the "this.empty" thing still works like shit
		this.num = num;
		if(this.num == -1) {
			this.div.innerText = '';
			this.empty = em || true;
		} else {
			this.div.innerText = this.num;
			this.empty = em || false;
		}
	}
}

function startGame() {
	addBlocks();
	gridInit();
	nextNumber();
}
function addBlocks() {
	for(let y = 0; y < d[0]; y++) {
		grid.push([]);
		for(let x = 0; x < d[0]; x++) {
			grid[y].push(new Block(y, x));
		}
	}
	let gridDiv = document.getElementById('grid');
	for(let y = 0; y < d[0]; y++) {
		let tr = elt('tr');
		gridDiv.appendChild(tr);
		for(let x = 0; x < d[0]; x++) {
			tr.appendChild(grid[x][y].div);
		}
	}
}
function gridInit() {
	for(let y = d[1]; y < d[0] - d[1]; y++) {
		for(let x = d[1]; x < d[0] - d[1]; x++)
			grid[x][y].setNum(random(0, 9));
	}
}
function nextNumber() {
	numbers[0] = numbers[1]; // next is now current
	numbers[1] = random(0, 9); // random replace next
	document.getElementById('cur').innerText = numbers[0];
	document.getElementById('nex').innerText = numbers[1];
}

// START GAME!!!
let grid = [];
startGame();

function random(min,max){return Math.round(Math.random()*(max-min)+min);}
function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}
