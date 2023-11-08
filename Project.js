//Set up the html canvas and make the context a 2d game.
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

context.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite
{
    constructor({position, velocity, color = 'red', offset})
    {
       this.position = position
       this.velocity = velocity
       this.width = 50
       this.height = 150
       this.lastKey
       this.attackBox = {
            position:
            {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset, // offset,
            width: 100,
            height: 50 
       }
       this.color = color
       this.isAttacking
       this.health = 100
    }

    draw()
    {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        //Attack Box is drawn
        if(this.isAttacking)
        {
        context.fillStyle = 'green'
        context.fillRect(
             this.attackBox.position.x,
             this.attackBox.position.y, 
             this.attackBox.width, 
             this.attackBox.height
             )
        }
    }

    update()
    {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height)
        {
            this.velocity.y = 0
        }
        else //Checks for the bottom of the screen in order to make sure gravity works properly.
        {
            this.velocity.y += gravity
        }
    }
    attack()
    {
        this.isAttacking = true
        setTimeout(() => {this.isAttacking = false}, 100)
    }
}

//wrapping in opening/closing brackets means you are specifying a object
//Our sprite has object with the x,y position.
const player = new Sprite({
    position: 
    {
        x: 0, 
        y:0
    },
    velocity:
    {
        x: 0,
        y: 0
    },
    offset:
    {
        x: 0,
        y: 0
    }
})
player.draw()

const enemy = new Sprite({
    position: 
    {
        x: 400, 
        y: 100
    },
    velocity:
    {
        x: 0,
        y: 0
    },
    offset:
    {
        x: -50,
        y: 0
    },
    color: 'blue'
   
})
enemy.draw()

console.log(player);

const keys = {
    a: 
    {
        pressed: false
    },
    d: 
    {
        pressed: false
    },
    w:
    {
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    },
    ArrowLeft:
    {
        pressed: false
    },
    ArrowUp:
    {
        pressed: false
    }
}

function rectangularCollision({rectangle1, rectangle2})
{
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
        rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

let timer = 10
function decreaseTimer()
{
    if(timer > 0)
    {
        setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    
    if(player.health === enemy.health)
    {
        // document.querySelector('#displayText').innerHTML = 'Tie'
        // document.querySelector('#displayText').style.display = 'flex'
        console.log("tie")
    }
}

decreaseTimer()
//Animation loop!
function animate()
{
    window.requestAnimationFrame(animate)
    //console.log('go')

    //Clears previous Rect so we are not painting.
    context.fillStyle = 'black'
    context.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

//Stops continous movement.
player.velocity.x = 0
enemy.velocity.x = 0

//Player Movement
    if(keys.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -5
    }
    else if(keys.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 5
    }
//Enemy Movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -5
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 5
    }

    //detect collisions on the axis
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy 
    }) && player.isAttacking)
    {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + "%"
    }

    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player 
    }) && enemy.isAttacking)
    {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + "%"

        //console.log('enemy attacked')
    }
    
}
animate()

//Arrow function shows event that happens when pressed.
window.addEventListener('keydown', (event) => {
    //console.log(event.key)
    switch(event.key)
    {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            keys.w.pressed = true
            break
        case ' ':
            player.attack()
            break
        //ENEMY MOVEMENTS
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            keys.ArrowUp.pressed = true
            break
        case 'ArrowDown':
            enemy.isAttacking = true
            break

    }
//console.log(event.key)
})

//Stops from forever moving to the right.
window.addEventListener('keyup', (event) => {
    switch(event.key)
    {
        case 'd':
        keys.d.pressed = false
            break
        case 'a':
        keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    //ENEMY KEYS
    switch(event.key)
    {
        case 'ArrowRight':
        keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break

       

    }
//console.log(event.key)
})