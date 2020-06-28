let bar_x = 0
//  Paddle
let point = 0
//  For keeping track of successful hits
let interval = 0
//  Pause in MS so game does not move too quickly
let interval_step = 0
//  Used to control game speed-up
let ball_x = 0
//  Keep track of ball X position
let ball_y = 0
//  Keep track of ball Y position
let ball_dx = 0
//  Keep track of ball X direction
let ball_dy = 0
//  Keep track of ball Y direction
let in_game = false
//  Used to signal end of game
//  往左
//  Draw new bar on line 4
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    //  Button A moves bar to left
    
    //  Make sure we refer to global variable
    if (bar_x > 0) {
        //  Check if bar is not already all the way to the left
        led.unplot(bar_x + 1, 4)
        //  Erase current bar on line 4
        bar_x = bar_x - 1
        //  Calculate new bar location one spot to the left
        led.plot(bar_x, 4)
    }
    
})
//  Setup ISR for A button
//  往右
//  Draw new bar on line 4 (turn on the LED here)
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    //  Button B moves bar to right
    
    //  Make sure we refer to the global variable
    if (bar_x < 3) {
        //  Check if bar is not already all the way on right
        led.unplot(bar_x, 4)
        //  Erase current bar on line 4 (turn off the LED here)
        bar_x = bar_x + 1
        //  Calculate new bar location one spot to the right
        led.plot(bar_x + 1, 4)
    }
    
})
//  Setup the ISR for B button
//  tell user that game is over
basic.forever(function on_forever() {
    
    //  refer to global variables
    point = 0
    //  start game with no points
    interval = 500
    //  pause between hits starts with 1/2 a second or 500 milliseconds
    interval_step = 10
    //  speed up game by 10 milliseconds after each hit to increaes challenge
    ball_x = 3
    //  start ball at x = 3, y = 4
    ball_y = 4
    ball_dx = -1
    //  start ball going left - every time make x smaller by 1
    ball_dy = -1
    //  start ball going up - every time make y smaller by 1
    bar_x = 0
    basic.showString("GO!")
    //  let palyer know we are starting the game
    led.plot(ball_x, ball_y)
    //  draw ball at starting location
    led.plot(bar_x, 4)
    //  draw the bar (paddle) left pixel
    led.plot(bar_x + 1, 4)
    //  draw the bar right pixel - the paddle is two pixes wide
    in_game = true
    //  start with game running
    while (in_game) {
        //  while game is still in running mode do the following
        if (ball_x + ball_dx > 4) {
            //  if the ball is all the way to the right then...
            ball_dx = ball_dx * -1
        } else if (ball_x + ball_dx < 0) {
            //      change the direction so that it moves left
            //  if the ball is all the way to the left then...
            ball_dx = ball_dx * -1
        }
        
        //      change the direction so that it moves right
        if (ball_y + ball_dy < 0) {
            //  if the ball is all the way at the top then...
            ball_dy = ball_dy * -1
        } else if (ball_y + ball_dy > 3) {
            //      change the direction so that it moves down
            //  if ball is all the way at the botton then...
            if (led.point(ball_x + ball_dx, ball_y + ball_dy)) {
                //  if the led is on here, this but be the paddle
                ball_dy = ball_dy * -1
                //  change ball direction to go up because we "hit" the ball
                point = point + 1
                //  since we hit the ball, add to our score!
                if (interval - interval_step >= 0) {
                    //  if we can, keep speeding up the game
                    interval = interval - interval_step
                }
                
            } else {
                //  reduce the delay so game moves faster
                in_game = false
            }
            
        }
        
        //  led was not on at this location so we missed it (game over)
        if (in_game) {
            //  if game is still running then...
            led.plot(ball_x + ball_dx, ball_y + ball_dy)
            //  draw ball at new location
            led.unplot(ball_x, ball_y)
            //  erase ball at old location
            ball_x = ball_x + ball_dx
            //  update ball x location by one
            ball_y = ball_y + ball_dy
            //  update ball y location by one
            basic.pause(interval)
        } else {
            //  pause to contrl speed of game
            game.setScore(point)
            //  game over, display score
            game.gameOver()
        }
        
    }
})
