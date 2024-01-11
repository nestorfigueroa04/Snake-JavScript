//Se obtienen los elementos div HTML por medio de su id 
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Se declaran algunas configuraciones iniciales
const boardSize = 10; //Tamaño del tablero
let gameSpeed = 500; //Velocidad del movimiento
//Tipos de cuadros posibles
const squareTypes = { 
    emptySquare: 0, //Cuadro vacio
    snakeSquare: 1, //Cuadro ocupado por serpiente
    foodSquare: 2 //Cuadro ocupado por comida
};
//Se realiza una mapeo de direcciones. cuando se analizo la matriz del tablero se evidencio que
const directions = {
    ArrowUp: -10,  //Para subir una casilla se resta 10 al idice en el que se encuetra la snake
    ArrowDown: 10, //Para bajar una casilla se suma 10 al idice en el que se encuetra la snake
    ArrowRight: 1, //Para ir a la derecha una casilla se suma 1 al idice en el que se encuetra la snake
    ArrowLeft: -1, //Para ir a la dizquierda una casilla se resta 1 al idice en el que se encuetra la snake
};

//Variable del juego que se modifican a medida que avanza el juego
let snake = []; //Array que representa los indices del snake
let score; //La puntuacion
let direction; //Direccion en la que se encuentra la serpietne
let boardSquares; //Matriz de donde se encuentran los index los cuadrados del tablero
let emptySquares; //Cuadros vacios del tablero
let moveInterval; //Intervalo de tiempo del movimiento

//Esta funcion manda a llamar la funcion para dibujer el tablero, pero le pasa las posiciones de la snake
const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare')); //Por cada elemento del array se le manda a la funcion para que lo dibuje de tipo snakeSquare
}

// square: posicion del cuadrado,
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
//Esta funcion dibuja el tablero
const drawSquare = (square, type) => {
    const [row, column] = square.split(''); //Se separa el numero de la fila del numero de la columna
    boardSquares[row][column] = squareTypes[type]; //Se guarda el tipo de cuadradito segun el id para poder agregarle la clase
    const squareElement = document.getElementById(square); //Recuperamos el elemento div correpondiente a ese id en html square
    squareElement.setAttribute('class', `square ${type}`); //A ese div se le aplica las clases correspondientes

    if(type === 'emptySquare') {
        emptySquares.push(square); //Se guarda la posicion de un cuadrado vacio en el array de cuadrados vacios
    } else {
        //Pregunta si en esa posicion el array de cuadros vacios ya existe un elemento con se id
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1); //Si existe ese elemento entonces se saca del array
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0'); //Toma el ultimo cuadrito del snake (cabeza) y se le suma el valor de la direccion a la que va a ir
    const [row, column] = newSquare.split(''); //Toma el valor por separado de la fila y la columna dl nuevoSquare 

        //Se hacen validaciones para ver si perdio
    if( newSquare < 0 || //Se fue para arriba
        newSquare > boardSize * boardSize  || //Se fue para abajo
        (direction === 'ArrowRight' && column == 0) || //Se fue para la derecha
        (direction === 'ArrowLeft' && column == 9 || //Se fue para la izquier
        boardSquares[row][column] === squareTypes.snakeSquare) ) { //Si ese square es un square de tipo snake es decir ya esta ocupado (choco contra si misma)
        gameOver();//Perdió
    } else {
        snake.push(newSquare); //Se agrega el nuevo elemento al array del snake
        if(boardSquares[row][column] === squareTypes.foodSquare) { //Pregunta si ese square es de comida
            addFood(); //Crece la serpiente
        } else {
            const emptySquare = snake.shift(); //Toma el primer elemento del snake es decir de la cola y
            drawSquare(emptySquare, 'emptySquare'); //Pinta esa cola como un cuadro vacio ya que se movio de ese cuadro
        }
        drawSnake();//Vuelve a dibujar la snake
    }
}

const addFood = () => {
    score++; //Aumenta el marcador
    //gameSpeed -= 1; //Aumenta la velocidad
    //speed();
    updateScore(); //Actualiza el marcador
    createRandomFood(); //Crea un nuevo squere de comida
}

const gameOver = () => {
    gameOverSign.style.display = 'block'; //Muestra el gameOver
    clearInterval(moveInterval);
    startButton.disabled = false;//Reinicia el boton
    alert("GAME OVER");
}

//Esta funcion setea la nueva direccion
const setDirection = newDirection => {
    direction = newDirection;
}

//Es funcion pregunta la posibilidad de un movimiento o direccion
const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code) //Es imposible que si esta yendo para arriba se oprima la tecla para ir hacia abajo
            break;                                             //Por lo que si es diferente entonces se setea esa nueva direccion por llamano la funcion setDirection
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]; //Posicion de un cuadrado vacio random
    drawSquare(randomEmptySquare, 'foodSquare'); //Se manda a llamar la funcion para dibujar el cuadrado de comida  
}

const updateScore = () => {
    scoreBoard.innerText = score; //Se imprime el score en el elemento div de socoreBoard
}

//Esta funcion crea el tablero pero sin dibujarlo
const createBoard = () => {
    //Se realiza una iteracion para ingresar a cada posicion de la matriz
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnndex) => {
            const squareValue = `${rowIndex}${columnndex}`; //Se crea un identificador para cada cuadrado squereValue[0][0], squereValue[0][1]
            const squareElement = document.createElement('div');//Se inserta un nuevo div en el html, cada cuadrito del tablero es un div con la clase y un id
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);//Se van agregando 
            emptySquares.push(squareValue); //En este array se guardan los identificadores de las posiciones de los cuadraditos vacios
        })
    })
}

//Esta funcion realiza un seteo inicial del juego cuando se da click al boton start
const setGame = () => {
    snake = ['00', '01', '02', '03']; //Se crea una snake con posicion inicial, matriz del tablero es 2x2 por eso el index 
    score = snake.length; //La puntuacion igual al largo de la snake
    direction = 'ArrowRight'; //Inicia moviendose a la derecha
    //Matriz de los cuadrados del tablero. Cada array de tipo fila tiene otro array de tipo columna y se inicializa con cuadrados vacios (0)
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares); //Se muestra la matriz en consola
    board.innerHTML = ''; //Borra cualquier contenido del div board
    emptySquares = []; //A medida que se crea el tablero se va llenando este array para guardar las posiciones de los cuadritos vacios
    createBoard(); 
}

//Esta funcion da comienzo al juego, es la primero que se llama
const startGame = () => {
    setGame(); 
    gameOverSign.style.display = 'none'; //Se oculta el div de gameOver
    startButton.disabled = true; //Se bloquea el boton de iniciar mientras este jugando
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent); //Escuchar los eventos de las flechas y se le pasa la tecla oprimida
    //speed();
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}
/*
const speed = () =>{
    moveInterval = setInterval( () => moveSnake(), gameSpeed); //funcion setInterval llama la funcion moveSnake cada 100ms
}*/