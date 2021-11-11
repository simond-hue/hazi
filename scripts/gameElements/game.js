class Game{
    static CELL_TYPES = ['none','arrow', 'pipe', 'three_way', 'two_way'];
    constructor(player_number, kincs_number){
        this.plain = document.createElement('div')
        this.initGameField();
        this.initGame(player_number, kincs_number)
        this.initOverboardField();
        this.initArrowListeners();
    }

    initGame(player_number, kincs_number){
        this.player_number = player_number;
        this.kincs_number = kincs_number;
        this.players = []
        let colors = [ {'r':184,'g':15,'b':10}, {'r':2,'g':105,'b':164}, {'r':236,'g':59,'b':131}, {'r':228,'g':208,'b':10} ]
        let corners = [{'i':1, 'j':1}, {'i':1, 'j':7}, {'i':7, 'j':1}, {'i':7, 'j':7}]
        corners.sort( () => .5 - Math.random() );
        for(let i = 0; i < this.player_number; i++){
            let position = corners.pop()
            this.players.push(new Player(`${i+1}. játékos`, colors[i], position, this.board.board[position.i][position.j].ui));
        }
        this.current_player = this.players[0];
        this.directions_to_move = this.board.getDirections(this.current_player);
    }

    initGameField(){
        document.body.removeChild(document.getElementById('menu_plain'));
        this.plain.classList.add('game_plain');
        this.plain.id = 'game_plain';
        this.initGameBoard();
        document.body.appendChild(this.plain);
    }

    initGameBoard(){
        this.board = new Board(this.plain);
    }

    initArrowListeners(){
        let arrows = this.board.getCells(Game.CELL_TYPES[1]);
        arrows.forEach(arrow =>{
            arrow.ui.addEventListener('click',(event) => {
                arrow.ui.current_arrow = arrow;
                arrow.ui.overboard_element = this.overboarded_cell;
                this.overboarded_cell = this.board.shift(event);
                this.updateUI();
            })
        })
    }

    updateUI(){
        this.board.updateUI();
        let overboard_old = this.overboard_plain;
        this.overboard_plain.remove();
        this.overboarded_cell.parent.appendChild(this.overboarded_cell.ui);
        this.plain.appendChild(overboard_old);
    }

    initOverboardField(){
        this.overboard_plain = document.createElement('div');
        this.overboard_plain.name = 'overboard';
        this.overboard_plain.id = 'overboard';
        this.overboard_plain.classList.add('overboard_field');
        
        let top_part = document.createElement('div');
        top_part.id = 'overboard_top';
        top_part.name = 'overboard_top';
        top_part.classList.add('overboard_top');

        let box = document.createElement('div');
        box.id = 'show_overboard_box';
        box.name = 'show_overboard_box';
        box.classList.add('show_overboard_box');
        this.overboarded_cell = new Cell(box,this.board.getOverboardedCell(),{'i': -1, 'j': -1},false,null);
        let overboard_subscript_box = document.createElement('div');
        overboard_subscript_box.id = 'show_overboard_box';
        overboard_subscript_box.name = 'show_overboard_box';
        overboard_subscript_box.classList.add('show_overboard_box');
        let overboard_subscript = document.createElement('h3');
        overboard_subscript.innerText = "A kieső elem"
        overboard_subscript.classList.add('overboard_subscript');
        overboard_subscript_box.appendChild(overboard_subscript);
        top_part.appendChild(overboard_subscript_box);
        top_part.appendChild(box);
        this.overboard_plain.appendChild(top_part);
        
        let bottom_part = document.createElement('div');
        bottom_part.id = 'overboard_bottom';
        bottom_part.name = 'overboard_bottom';
        bottom_part.classList.add('overboard_bottom');
        let rotate_button = document.createElement('button'); 
        rotate_button.classList.add('rotate_button')
        rotate_button.id = 'rotate_button';
        rotate_button.name = 'rotate_button';
        rotate_button.innerText = 'Forgatás';
        rotate_button.addEventListener('click', ()=> this.overboarded_cell.rotate90());
        bottom_part.appendChild(rotate_button);
        this.overboard_plain.appendChild(bottom_part);
        
        this.plain.appendChild(this.overboard_plain);
    }
}

class Player{
    constructor(name, color, position, parent){
        this.name = name;
        this.parent = parent;
        this.color = color;
        this.position = position;
        this.initUI();
    }
    initUI(){
        this.ui = document.createElement('div');
        this.ui.classList.add('player');
        this.ui.name = 'player';
        this.ui.id = 'player';
        this.ui.style.backgroundColor = `rgb(${this.color.r},${this.color.g},${this.color.b})`;
        this.parent.appendChild(this.ui);
    }
}

class Board{
    constructor(parent){
        this.parent = parent;
        this.board = [];
        this.initUI();
    }

    getDirections(player){
        let starting_at = this.board[player.position.i][player.position.j];
        let out = this.findRoute(starting_at, [starting_at]);
        console.log(out)
    }
    findRoute(start, acc){
        let i = start.position.i;
        let j = start.position.j;
        let neighbours = [];
        neighbours['upper'] = this.board[i-1][j];
        neighbours['lower'] = this.board[i+1][j];
        neighbours['left'] = this.board[i][j-1];
        neighbours['right'] = this.board[i][j+1];
        if(start.doors['up'] && neighbours['upper'].doors['down'] && !acc.includes(neighbours['upper'])){
            acc.push(neighbours['upper'])
            this.findRoute(neighbours['upper'], acc);
        }
        if(start.doors['right'] && neighbours['right'].doors['left'] && !acc.includes(neighbours['right'])){
            acc.push(neighbours['right']);
            this.findRoute(neighbours['right'], acc);
        }
        if(start.doors['left'] && neighbours['left'].doors['right'] && !acc.includes(neighbours['left'])){
            acc.push(neighbours['left']);
            this.findRoute(neighbours['left'], acc);
        }
        if(start.doors['down'] && neighbours['lower'].doors['up'] && !acc.includes(neighbours['lower'])){
            acc.push(neighbours['lower']);
            this.findRoute(neighbours['lower'], acc);
        }
        return acc;
    }

    initUI(){
        this.ui = document.createElement('div');
        this.ui.id = 'game_main';
        this.ui.classList.add('game_main');
        this.initCells();
        this.parent.appendChild(this.ui);
    }

    initCells(){
        this.elements = [];
        for(let i = 0; i < 13; i++){
            this.elements.push(Game.CELL_TYPES[2]);
        }
        for(let i = 0; i < 15; i++){
            this.elements.push(Game.CELL_TYPES[4]);
        }
        for(let i = 0; i < 6; i++){
            this.elements.push(Game.CELL_TYPES[3]);
        }
        this.elements.sort( () => .5 - Math.random() );
        for(let i = 0; i < 9; i++){
            let line = []
            let row = document.createElement('div');
            row.id = 'row';
            row.classList.add('row');
            for(let j = 0; j < 9; j++){
                let type = Game.CELL_TYPES[0];
                let fixed = false;
                let direction = null;
                if(((i == 0 || i == 8) && (j!=0 && j!=8 && j%2 == 0)) || ((i!=0 && i!=8) && (j == 0 || j == 8) && (i%2==0))){
                    type = Game.CELL_TYPES[1];
                    if(i == 0){ direction = 'down'; }
                    if(i == 8){ direction = 'up'; }
                    if(i > 0 && i < 8){
                        if(j == 0){ direction = 'right'; }
                        if(j == 8){ direction = 'left'; }
                    }
                }
                else if(i>0 && i<8 && j>0 && j<8){
                    if((i%2 == 1 && j%2 == 1)){
                        fixed = true;
                        if((j == 1 || j == 7) && (i == 1 || i == 7)){
                            type = Game.CELL_TYPES[4];
                        }
                        else{
                            type = Game.CELL_TYPES[3];
                        }
                    }
                    else{
                        type = this.elements.pop();
                    }
                }
                line.push(new Cell(row,type,{'i': i,'j': j},fixed,direction));
            }
            this.ui.appendChild(row);
            this.board.push(line);
        }
        console.log(this.board);
    }

    getOverboardedCell(){
        return this.elements.pop();
    }

    getCells(type){
        let cells = []
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                if(this.board[i][j].type == type){
                   cells.push(this.board[i][j]);
                }
            }
        }
        return cells;
    }

    shift(event){
        let arrow = event.target.current_arrow;
        let new_overboard_element = null;
        let old_overboard_element = event.target.overboard_element;
        if(arrow.direction == 'right'){
            let row = arrow.position.i;      
            new_overboard_element = this.board[row][7];
            Cell.switchParent(new_overboard_element,old_overboard_element);
            Cell.switchUI(new_overboard_element,old_overboard_element);
            this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
            this.board[row].splice(1,0,old_overboard_element);
            for(let i = 1; i < 8; i++){
                this.board[row][i].position.j = i;
                this.board[row][i].position.i = row;
            }
        }
        if(arrow.direction == 'left'){
            let row = arrow.position.i;      
            new_overboard_element = this.board[row][1];
            Cell.switchParent(new_overboard_element,old_overboard_element);
            Cell.switchUI(new_overboard_element,old_overboard_element);
            this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
            this.board[row].splice(7,0,old_overboard_element);
            for(let i = 1; i < 8; i++){
                this.board[row][i].position.j = i;
                this.board[row][i].position.i = row;
            }
        }
        if(arrow.direction == 'down'){
            let column = arrow.position.j;      
            new_overboard_element = this.board[7][column];
            Cell.switchParent(new_overboard_element,old_overboard_element);
            Cell.switchUI(new_overboard_element,old_overboard_element);
            for(let i = 7; i > 0; i--){
                if(i != 1) this.board[i][column] = this.board[i-1][column];
                if(i == 1) this.board[i][column] = old_overboard_element;
                this.board[i][column].position.j = column;
                this.board[i][column].position.i = i;
            }
        }
        if(arrow.direction == 'up'){
            let column = arrow.position.j;      
            new_overboard_element = this.board[1][column];
            Cell.switchParent(new_overboard_element,old_overboard_element);
            Cell.switchUI(new_overboard_element,old_overboard_element);
            for(let i = 1; i < 8; i++){
                if(i != 7) this.board[i][column] = this.board[i+1][column];
                if(i == 7) this.board[i][column] = old_overboard_element;
                this.board[i][column].position.j = column;
                this.board[i][column].position.i = i;
            }
        }
        return new_overboard_element;
    }

    updateUI(){
        this.ui.remove();
        this.ui = document.createElement('div');
        this.ui.id = 'game_main';
        this.ui.classList.add('game_main');
        this.appendCells()
        this.parent.appendChild(this.ui);
    }

    appendCells(){
        for(let i = 0; i < this.board.length; i++){
            let row = document.createElement('div');
            row.id = 'row';
            row.classList.add('row');
            for(let j = 0; j < this.board.length; j++){
                row.appendChild(this.board[i][j].ui);
            }
            this.ui.appendChild(row);
        }
    }
}

class Cell{
    constructor(parent, type, position,fixed,direction){
        this.fixed = fixed;
        this.direction = direction;
        this.position = position;
        this.parent = parent;
        this.doors = []
        this.type = type;
        this.rotatedBy = 0;
        this.generateDoors();
        this.initUI()
    }

    generateDoors(){
        if(this.type == Game.CELL_TYPES[0] || this.type == Game.CELL_TYPES[1]){
            this.setDoors(false,false,false,false);  
        }
        else if(this.type == Game.CELL_TYPES[2]){
            this.setDoors(false,false,true,true);
        }
        else if(this.type == Game.CELL_TYPES[3]){
            this.setDoors(true,false,true,true)
        }
        else if(this.type == Game.CELL_TYPES[4]){
            this.setDoors(false,true,false,true)
        }
    }

    setDoors(up,down,left,right){
        this.doors['up'] = up
        this.doors['down'] = down
        this.doors['left'] = left
        this.doors['right'] = right  
    }

    initUI(){
        this.ui = document.createElement('div');
        if(this.position.i != -1 && this.position.j != -1){
            this.ui.classList.add('cell');
            this.ui.id = 'cell';
        }
        else if(this.position.i == -1 &&this.position.j == -1){
            this.ui.classList.add('overboard_cell');
            this.ui.id = 'overboard_cell'
        } 
        this.addImage();
        this.parent.appendChild(this.ui);
    }

    addImage(){
        if(this.type == Game.CELL_TYPES[1]){
            this.ui.classList.add('arrow')
            if(this.position.i == 8){
                this.ui.classList.add('rotate_180');
            }
            if(this.position.i < 8 && this.position.i > 0 && this.position.j == 0){
                this.ui.classList.add('rotate_270');
            }
            if(this.position.i < 8 && this.position.i > 0 && this.position.j == 8){
                this.ui.classList.add('rotate_90');
            }
            return;
        }
        switch(this.type){
            case Game.CELL_TYPES[2]:
                this.ui.classList.add('pipe');
                break;
            case Game.CELL_TYPES[3]:
                this.ui.classList.add('three_way');
                break;
            case Game.CELL_TYPES[4]:
                this.ui.classList.add('two_way');
                break;       
        }
        if(this.fixed){
            this.rotate_properly();
            return;
        }
        let rng = Math.floor(Math.random()*4);
        if(rng == 1){
            this.rotate90();
        }
        if(rng == 2){
            this.rotate180();
        }
        if(rng == 3){
            this.rotate270();
        }
    }

    rotate_properly(){
        if(this.type == Game.CELL_TYPES[4]){
            if(this.position.i == 1 && this.position.j == 7){
                this.rotate90();
            }
            else if(this.position.i == 7 && this.position.j == 1){
                this.rotate270();
            }
            else if(this.position.i == 7 && this.position.j == 7){
                this.rotate180();
            }
        }
        if(this.type == Game.CELL_TYPES[3]){
            if(this.position.i == 1){
                this.rotate180();
            }
            else if(this.position.i != 1 && this.position.i != 7){
                if(this.position.j == 1 || (this.position.i == 3 && this.position.j == 3)){
                    this.rotate90();
                }
                else if(this.position.j == 7 || (this.position.i == 5 && this.position.j == 5)){
                    this.rotate270();
                }
                else if((this.position.i == 3 && this.position.j == 5)){
                    this.rotate180();
                }
            }
        }
    }
    
    rotate90(){
        if(this.rotatedBy == 450) this.rotatedBy = 90
        this.rotatedBy += 90;
        if(this.rotatedBy != 0){
            this.ui.classList.remove(`rotate_${(this.rotatedBy - 90) % 360}`)
            this.ui.classList.add(`rotate_${(this.rotatedBy) % 360}`)
        }
        this.setDoors(this.doors['left'],this.doors['right'],this.doors['down'],this.doors['up']);
    }

    rotate180(){
        this.rotate90();
        this.rotate90();
    }

    rotate270(){
        this.rotate90();
        this.rotate90();
        this.rotate90();
    }

    static switchParent(cell1, cell2){
        let old_parent = cell1.parent;
        cell1.parent = cell2.parent;
        cell2.parent = old_parent;
    }

    static switchUI(new_overboard_element, old_overboard_element){
        new_overboard_element.ui.classList.add('overboard_cell');
        new_overboard_element.ui.id = 'overboard_cell';
        new_overboard_element.ui.classList.remove('cell');
        old_overboard_element.ui.classList.add('cell');
        old_overboard_element.ui.classList.remove('overboard_cell');
        old_overboard_element.ui.id = 'cell';
    }
}