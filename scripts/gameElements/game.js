/*
    TODO: BUGOS A MOVEMENT UI-OKAT UPDATELNI KELL
          TURN BASED
          JÁTÉKOS ADATAINAK KIÍRÁSA
          ENDCHECK
*/

class Game{
    static CELL_TYPES = ['none','arrow', 'pipe', 'three_way', 'two_way'];
    constructor(player_number, kincs_number){
        this.plain = document.createElement('div')
        this.initGameField();
        this.initGame(player_number, kincs_number)
        this.initOverboardField();
        this.initListeners();
        this.addEventListenerToCells();
    }

    
    addEventListenerToCells(){
        for(let i = 1; i < 8; i++){
            for(let j = 1; j < 8; j++){
                this.board.board[i][j].ui.addEventListener('click', e=>{
                    if(this.board.board[i][j].canBeClicked){
                        this.board.movePlayer(this.current_player,this.board.board[i][j]);
                        for(let k = 1; k < 8; k++){
                            for(let l = 1; l < 8; l++){
                                this.board.board[l][k].canBeClicked = false;
                            }
                        }
                    }
                })
            }
        }
    }

    initGame(player_number, kincs_number){
        this.player_number = player_number;
        this.kincs_number = kincs_number;
        this.players = []
        let colors = [ {'r':184,'g':15,'b':10}, {'r':2,'g':105,'b':164}, {'r':236,'g':59,'b':131}, {'r':228,'g':208,'b':10} ]
        let corners = [{'i':1, 'j':1}, {'i':1, 'j':7}, {'i':7, 'j':1}, {'i':7, 'j':7}]
        corners.sort( () => .5 - Math.random() );
        let possible_treasure_positions = [];
        for(let i = 1; i< 8; i++){
            for(let j = 1;j < 8; j++){
                let is_corner = false;
                for(let k = 0; k < corners.length; k++){
                    if(corners[k].i == i && corners[k].j == j){
                        is_corner = true;
                        break;
                    }
                }
                if(!is_corner) possible_treasure_positions.push({'i':i,'j':j});
            }
        }
        possible_treasure_positions.sort( () => .5 - Math.random() );
        for(let i = 0; i < this.player_number; i++){
            let position = corners.pop();
            let kincsek = [];
            let color = colors[i];
            for(let j = 0; j < this.kincs_number; j++){
                let treasue_pos = possible_treasure_positions.pop();
                let treasure = new Treasure(color,treasue_pos,this.board.board[treasue_pos.i][treasue_pos.j].ui,false)
                kincsek.push(treasure);
                this.board.board[treasue_pos.i][treasue_pos.j].treasure = treasure; 
            }
            this.players.push(new Player(`${i+1}. játékos`, color, position, this.board.board[position.i][position.j].ui, kincsek));
        }
        this.current_player = this.players[0];
        this.turn = 0;
        this.gameEnded = false;
        this.startTurn()
    }

    startTurn(){
        let player_can_move = this.board.getDirections(this.current_player);
        player_can_move.forEach(e => {
            this.apply_can_move(e.ui);
        });
    }
    
    apply_can_move(ui){
        ui.style.boxShadow = `inset 0px 0px 0px 2px rgb(${this.current_player.color.r},${this.current_player.color.g},${this.current_player.color.b})`
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

    initListeners(){
        let arrows = this.board.getCells(Game.CELL_TYPES[1]);
        arrows.forEach(arrow =>{
            arrow.ui.addEventListener('click',(event) =>{
                if(!this.current_player.movedBoard){
                    this.current_player.movedBoard = true;
                    arrow.ui.current_arrow = arrow;
                    arrow.ui.overboard_element = this.overboarded_cell;
                    arrow.ui.player = this.current_player;
                    arrow.ui.game = this;
                    this.overboarded_cell = this.board.shift(event);
                    this.updateUI();
                    let player_can_move = this.board.getDirections(this.current_player);
                    player_can_move.forEach(e => {
                        e.canBeClicked = true;
                        this.apply_can_move(e.ui);
                    });
                }
            });
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

        let overboard_current_player_box = document.createElement('div');
        overboard_current_player_box.id = 'show_overboard_box';
        overboard_current_player_box.name = 'show_overboard_box';
        overboard_current_player_box.classList.add('show_overboard_box');
        let overboard_show_player = document.createElement('div');
        overboard_show_player.classList.add('show_player');
        overboard_show_player.style.backgroundColor = `rgb(${this.current_player.color.r},${this.current_player.color.g},${this.current_player.color.b})`;
        overboard_current_player_box.appendChild(overboard_show_player)

        let show_player_subscript_box = document.createElement('div');
        show_player_subscript_box.id = 'show_overboard_box';
        show_player_subscript_box.name = 'show_overboard_box';
        show_player_subscript_box.classList.add('show_overboard_box');
        let show_player_subscript = document.createElement('h3');
        show_player_subscript.innerHTML = `A jelenlegi játékos:<br>${this.current_player.name}`
        show_player_subscript.classList.add('overboard_subscript');
        show_player_subscript_box.appendChild(show_player_subscript);

        top_part.appendChild(show_player_subscript_box);
        top_part.appendChild(overboard_current_player_box);
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
    constructor(name, color, position, parent, kincsek){
        this.name = name;
        this.parent = parent;
        this.color = color;
        this.position = position;
        this.movedBoard = false;
        this.starting_position = position;
        this.kincsek = []
        kincsek.forEach((e)=> this.kincsek.push(e));
        this.initUI();
    }

    removeTreasure(){
        this.kincsek.forEach(t =>{
            if(t.position.i = this.position.i && t.position.j == this.position.j){
                this.kincsek.splice(this.kincsek.indexOf(t),1);
                console.log(this.kincsek);
                return; 
            }
        })
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

class Treasure{
    constructor(color, position, parent, isPickedUp){
        this.color = color;
        this.position = position;
        this.isPickedUp = isPickedUp;
        this.parent = parent;
        this.initUI();
    }
    initUI(){
        this.ui = document.createElement('div');
        this.ui.classList.add('treasure');
        this.ui.name = 'treasure';
        this.ui.id = 'treasure';
        this.ui.style.backgroundColor = `rgb(${this.color.r},${this.color.g},${this.color.b})`;
        this.ui.style.boxShadow = `0 0 10px rgb(${this.color.r},${this.color.g},${this.color.b})`;
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
        return out;
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
        let last_move = event.target.game.last_move;
        let arrow = event.target.current_arrow;
        let new_overboard_element = null;
        let old_overboard_element = event.target.overboard_element;
        if(last_move){
            if((last_move.direction == 'up' && arrow.direction == 'down') || (last_move.direction == 'down' && arrow.direction == 'up')){
                if(last_move.position.j == arrow.position.j){
                    return old_overboard_element;
                }
            }
            if((last_move.direction == 'left' && arrow.direction == 'right') || (last_move.direction == 'right' && arrow.direction == 'left')){
                if(last_move.position.i == arrow.position.i){
                    return old_overboard_element;
                }
            }
        }
        if(arrow.direction == 'right'){
            let row = arrow.position.i;      
            new_overboard_element = this.board[row][7];
            if(new_overboard_element.ui.innerHTML){
                this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
                this.board[row].splice(1,0,new_overboard_element);
                for(let i = 1; i < 8; i++){
                    this.board[row][i].position.j = i;
                    this.board[row][i].position.i = row;
                }
                return old_overboard_element;
            }
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
            if(new_overboard_element.ui.innerHTML){
                this.board[row].splice(this.board[row].indexOf(new_overboard_element),1);
                this.board[row].splice(7,0,new_overboard_element);
                for(let i = 1; i < 8; i++){
                    this.board[row][i].position.j = i;
                    this.board[row][i].position.i = row;
                }
                return old_overboard_element;
            }
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
            if(new_overboard_element.ui.innerHTML) {
                for(let i = 7; i > 0; i--){
                    if(i != 1) this.board[i][column] = this.board[i-1][column];
                    if(i == 1) this.board[i][column] = new_overboard_element;
                    this.board[i][column].position.j = column;
                    this.board[i][column].position.i = i;
                }
                return old_overboard_element;
            }
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
            if(new_overboard_element.ui.innerHTML){ 
                for(let i = 1; i < 8; i++){
                    if(i != 7) this.board[i][column] = this.board[i+1][column];
                    if(i == 7) this.board[i][column] = new_overboard_element;
                    this.board[i][column].position.j = column;
                    this.board[i][column].position.i = i;
                }
                return old_overboard_element;
            }
            Cell.switchParent(new_overboard_element,old_overboard_element);
            Cell.switchUI(new_overboard_element,old_overboard_element);
            for(let i = 1; i < 8; i++){
                if(i != 7) this.board[i][column] = this.board[i+1][column];
                if(i == 7) this.board[i][column] = old_overboard_element;
                this.board[i][column].position.j = column;
                this.board[i][column].position.i = i;
            }
        }
        event.target.game.last_move = arrow;
        return new_overboard_element;
    }

    updateUI(){
        this.ui.remove();
        this.ui = document.createElement('div');
        this.ui.id = 'game_main';
        this.ui.classList.add('game_main');
        for(let i = 1; i < 8; i++){
            for(let j = 0; j < 8; j++){
                this.board[i][j].ui.remove();
                this.board[i][j].updateUI();
            }
        }
        this.appendCells()
        this.parent.appendChild(this.ui);
    }

    appendCells(){
        for(let i = 0; i < this.board.length; i++){
            let row = document.createElement('div');
            row.id = 'row';
            row.classList.add('row');
            for(let j = 0; j < this.board.length; j++){
                this.board[i][j].ui.style.boxShadow = null;
                row.appendChild(this.board[i][j].ui);
            }
            this.ui.appendChild(row);
        }
    }

    movePlayer(player, cell){
        player.position = cell.position;
        cell.ui.appendChild(player.ui);
        player.ui.remove();
        player.parent = cell.ui;
        player.initUI();
        if(cell.treasure && player.kincsek.includes(cell.treasure)){
            player.removeTreasure();
        }
    }
}

class Cell{
    constructor(parent, type, position,fixed,direction){
        this.treasure = null;
        this.fixed = fixed;
        this.direction = direction;
        this.position = position;
        this.parent = parent;
        this.doors = []
        this.type = type;
        this.rotatedBy = 0;
        this.canBeClicked = false;
        this.generateDoors();
        this.initUI()
        if(this.fixed){
            this.rotate_properly();
            return;
        }
        if(this.type != Game.CELL_TYPES[0] && this.type != Game.CELL_TYPES[1]){
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

    static switchUIComp(cell1, cell2){
        let tmp = cell1.ui;
        cell1.ui = cell2.ui;
        cell2.ui = tmp;
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