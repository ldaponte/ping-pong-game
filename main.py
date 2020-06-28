bar_x = 0               # Paddle
point = 0               # For keeping track of successful hits
interval = 0            # Pause in MS so game does not move too quickly
interval_step = 0       # Used to control game speed-up
ball_x = 0              # Keep track of ball X position
ball_y = 0              # Keep track of ball Y position
ball_dx = 0             # Keep track of ball X direction
ball_dy = 0             # Keep track of ball Y direction
in_game = False         # Used to signal end of game

# 往左

def on_button_pressed_a():          # Button A moves bar to left
    global bar_x                    # Make sure we refer to global variable
    if bar_x > 0:                   # Check if bar is not already all the way to the left
        led.unplot(bar_x + 1, 4)    # Erase current bar on line 4
        bar_x = bar_x - 1           # Calculate new bar location one spot to the left
        led.plot(bar_x, 4)          # Draw new bar on line 4

input.on_button_pressed(Button.A, on_button_pressed_a)  # Setup ISR for A button

# 往右

def on_button_pressed_b():          # Button B moves bar to right
    global bar_x                    # Make sure we refer to the global variable
    if bar_x < 3:                   # Check if bar is not already all the way on right
        led.unplot(bar_x, 4)        # Erase current bar on line 4 (turn off the LED here)
        bar_x = bar_x + 1           # Calculate new bar location one spot to the right
        led.plot(bar_x + 1, 4)      # Draw new bar on line 4 (turn on the LED here)

input.on_button_pressed(Button.B, on_button_pressed_b)  # Setup the ISR for B button

def on_forever():
    global point, interval, interval_step, ball_x, ball_y, ball_dx, ball_dy, bar_x, in_game # refer to global variables
    point = 0                               # start game with no points
    interval = 500                          # pause between hits starts with 1/2 a second or 500 milliseconds
    interval_step = 10                      # speed up game by 10 milliseconds after each hit to increaes challenge
    ball_x = 3                              # start ball at x = 3, y = 4
    ball_y = 4
    ball_dx = -1                            # start ball going left - every time make x smaller by 1
    ball_dy = -1                            # start ball going up - every time make y smaller by 1
    bar_x = 0
    basic.show_string("GO!")                # let palyer know we are starting the game
    led.plot(ball_x, ball_y)                # draw ball at starting location
    led.plot(bar_x, 4)                      # draw the bar (paddle) left pixel
    led.plot(bar_x + 1, 4)                  # draw the bar right pixel - the paddle is two pixes wide
    in_game = True                          # start with game running
    while in_game:                          # while game is still in running mode do the following
        if ball_x + ball_dx > 4:            # if the ball is all the way to the right then...
            ball_dx = ball_dx * -1          #     change the direction so that it moves left
        elif ball_x + ball_dx < 0:          # if the ball is all the way to the left then...
            ball_dx = ball_dx * -1          #     change the direction so that it moves right
        if ball_y + ball_dy < 0:            # if the ball is all the way at the top then...
            ball_dy = ball_dy * -1          #     change the direction so that it moves down
        elif ball_y + ball_dy > 3:          # if ball is all the way at the botton then...
            if led.point(ball_x + ball_dx, ball_y + ball_dy):   # if the led is on here, this but be the paddle
                ball_dy = ball_dy * -1                          # change ball direction to go up because we "hit" the ball
                point = point + 1                               # since we hit the ball, add to our score!
                if interval - interval_step >= 0:               # if we can, keep speeding up the game
                    interval = interval - interval_step         # reduce the delay so game moves faster
            else:
                in_game = False                                 # led was not on at this location so we missed it (game over)
        if in_game:                                             # if game is still running then...
            led.plot(ball_x + ball_dx, ball_y + ball_dy)        # draw ball at new location
            led.unplot(ball_x, ball_y)                          # erase ball at old location
            ball_x = ball_x + ball_dx                           # update ball x location by one
            ball_y = ball_y + ball_dy                           # update ball y location by one
            basic.pause(interval)                               # pause to contrl speed of game
        else:
            game.set_score(point)                               # game over, display score
            game.game_over()                                    # tell user that game is over

basic.forever(on_forever)                                       # This is actually the start of the program because
                                                                # it is indented all the way to the left (explain please)
