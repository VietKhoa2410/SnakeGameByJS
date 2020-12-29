
    const board_border = 'black';
    const board_background = "white";
    const snake_col = 'lightblue';
    const snake_border = 'darkblue';
    
    let snake = [
      {x: 240, y: 200},
      {x: 220, y: 200},
      {x: 200, y: 200},
      {x: 180, y: 200},
      {x: 160, y: 200}
    ]

    let score = 0;
    // True if changing direction
    let changing_direction = false;
    // Horizontal velocity
    let food_x;
    let food_y;
    let step=20;
    let dx = step;
    // Vertical velocity
    let dy = 0;
    
    
    // Get the canvas element
    const board = document.getElementById("board");
    // Return a two dimensional drawing context
    const board_ctx = board.getContext("2d");
    // Start game
    main();

    gen_food();

    document.addEventListener("keydown", change_direction);
    
    // main function called repeatedly to keep the game running
    function main() {

        if (has_game_ended()) return;

        changing_direction = false;
        setTimeout(function onTick() {
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        // Repeat
        main();
      }, 100)
    }
    
    // draw a border around the canvas
    function clear_board() {
      //  Select the colour to fill the drawing
      board_ctx.fillStyle = board_background;
      //  Select the colour for the border of the canvas
      board_ctx.strokestyle = board_border;
      // Draw a "filled" rectangle to cover the entire canvas
      board_ctx.fillRect(0, 0, board.width, board.height);
      // Draw a "border" around the entire canvas
      board_ctx.strokeRect(0, 0, board.width, board.height);
    }
    
    // Draw the snake on the canvas
    function drawSnake() {
      // Draw each part
      snake.forEach(drawSnakePart)
    }

    function drawFood() {
      board_ctx.fillStyle = 'lightgreen';
      board_ctx.strokestyle = 'darkgreen';
      board_ctx.fillRect(food_x, food_y, step, step);
      board_ctx.strokeRect(food_x, food_y, step, step);
    }
    
    // Draw one snake part
    function drawSnakePart(snakePart) {

        // Set the colour of the snake part
        board_ctx.fillStyle = snake_col;
        // Set the border colour of the snake part
        board_ctx.strokestyle = snake_border;
        // Draw a "filled" rectangle to represent the snake part at the coordinates
        // the part is located
        board_ctx.fillRect(snakePart.x, snakePart.y, step, step);
        // Draw a border around the snake part
        board_ctx.strokeRect(snakePart.x, snakePart.y, step, step);
    }

    function has_game_ended() {
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
      }
      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > board.width - step;
      const hitToptWall = snake[0].y < 0;
      const hitBottomWall = snake[0].y > board.height - step;
      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    function random_food(min, max) {
      return Math.round((Math.random() * (max-min) + min) / step) * step;
    }

    function gen_food() {
      // Generate a random number the food x-coordinate
      food_x = random_food(0, board.width - step);
      // Generate a random number for the food y-coordinate
      food_y = random_food(0, board.height - step);
      // if the new food location is where the snake currently is, generate a new food location
      snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
      });
    }

    function change_direction(event) {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      
    // Prevent the snake from reversing
    
      if (changing_direction) return;
      changing_direction = true;
      const keyPressed = event.keyCode;
      const goingUp = dy === -step;
      const goingDown = dy === step;
      const goingRight = dx === step;
      const goingLeft = dx === -step;
      if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -step;
        dy = 0;
      }
      if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -step;
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = step;
        dy = 0;
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = step;
      }
    }

    function move_snake() {
      // Create the new Snake's head
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      // Add the new head to the beginning of snake body
      snake.unshift(head);
      const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
      if (has_eaten_food) {
        // Increase score
        score += 10;
        // Display score on screen
        document.getElementById('score').innerHTML = score;
        // Generate new food location
        gen_food();
      } else {
        // Remove the last part of snake body
        snake.pop();
      }
    }
    