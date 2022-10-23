import React, { useEffect, useRef } from "react";
import "./bird.css";
document.body.style.backgroundImage = "url(bg.png)"
document.body.style.backgroundSize = "1350px, 720px"

const Main = () => {
    const canvasRef = useRef(null)
    let canvas
    let ctx
    let dy = 0
    let draw
    let gravity = 0.11
    let score = 0
    let once = true
    let end = false
    let pause = false
    let hit = document.getElementById("hit")
    let fly = document.getElementById("fly")
    let ball = { x: window.innerWidth / 4 - 10, y: window.innerHeight / 2 - 5, r: 10, sAngle: 0, eAngle: 2 * Math.PI, c: null }
    let bup = { x: null, y: null, w: 100, h: 500 }
    let bd = { x: null, y: null, w: 100, h: 500 }
    if (localStorage.getItem("highscore") == null) localStorage.setItem("highscore", 0)

    useEffect(() => {
        canvas = canvasRef.current
        if (!canvas) return
        ctx = canvas.getContext("2d")
        canvas.width = window.innerWidth - 10
        canvas.height = window.innerHeight - 5

        document.addEventListener('keydown' || "touchstart", async function (e) {
            if (e.keyCode === 32 && pause == false) {
                dy = 2
                fly.play()
                if (once) {
                    once = false
                }
                if (dy > 0) {
                    dy = -4.20
                }
            }
            if (!end) {
                if (e.keyCode === 27) {
                    if (!once && !pause) {
                        once = true
                        pause = true
                        ctx.font = "3em cursive"
                        ctx.fillStyle = "black"
                        ctx.textAlign = "center"
                        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2)
                        clearInterval(draw);
                    } else if (once && pause) {
                        once = false
                        pause = false
                        interval()
                    }
                }
            }
        })
        if (once) {
            ctx.font = "3em cursive"
            ctx.fillStyle = "black"
            ctx.textAlign = "center"
            ctx.fillText("PRESS 'SPACE' TO START", canvas.width / 2, canvas.height / 2 - 50)
            ctx.fillText("PRESS 'ESC' TO PAUSE", canvas.width / 2, canvas.height / 2 + 50)
        }
        bup.x = canvas.width + 10
        bd.x = canvas.width + 10
        bup.y = randomInt(-50, -400)
        bd.y = bup.y + 669

    }, [canvas])

    function colliding(u) {
        let distX = Math.abs(ball.x - u.x - u.w / 2)
        let distY = Math.abs(ball.y - u.y - u.h / 2)

        if (distX > (u.w / 2 + (ball.r + 5))) { return false }
        if (distY > (u.h / 2 + (ball.r + 5))) { return false }

        if (distX <= (u.w / 2)) { return true }
        if (distY <= (u.h / 2)) { return true }

        let dx2 = distX - u.w / 2
        let dy2 = distY - u.h / 2
        return (dx2 * dx2 + dy2 * dy2 <= ((ball.r + 5) * (ball.r + 5)))
    }

    function circle() {
        ctx.beginPath()
        ctx.lineWidth = "10"
        ctx.arc(ball.x, ball.y, ball.r, ball.sAngle, ball.eAngle)
        ball.c = ctx.createRadialGradient(ball.x, ball.y, 5, ball.x, ball.y, 16)
        ball.c.addColorStop(0, "red")
        ball.c.addColorStop(1, "orange")
        ctx.fillStyle = ball.c
        ctx.strokeStyle = ball.c
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }


    function rectup() {
        ctx.beginPath()
        ctx.lineJoin = "round"
        ctx.lineWidth = "6"
        ctx.strokeStyle = "green"
        ctx.rect(bup.x, bup.y, bup.w, bup.h)
        ctx.fillStyle = "green"
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

    function rectdown() {
        ctx.beginPath()
        ctx.lineJoin = "round"
        ctx.lineWidth = "6"
        ctx.strokeStyle = "green"
        ctx.rect(bd.x, bd.y, bd.w, bd.h)
        ctx.fillStyle = "green"
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

    async function clear() {
        ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2)
        ctx.font = "4em cursive"
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.fillText(score, canvas.width / 2, canvas.height / 3)
        circle()
        rectdown()
        rectup()

    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    interval()
    function interval() {
        console.log(once)
        draw = setInterval(() => {
            ball.y += dy
            if (!once) {
                bup.x -= 3
                bd.x -= 3
                dy += gravity
                clear()
            }

            if (bup.x === -110) {
                bup.y = randomInt(-50, -400)
                bd.y = bup.y + 669
                bup.x = canvas.width + 10
                bd.x = canvas.width + 10
            }
            if (ball.y < (bup.y + 680) && ball.y > (bup.y + 500) && ball.x <= bup.x + 100 && ball.x >= bup.x + 98) score++
            if (colliding(bup) || colliding(bd) || ball.y < -100 || ball.y + ball.r >= canvas.height) {
                hit.play()
                end = true
                ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2)
                if (localStorage.getItem("highscore") < score) {
                    localStorage.setItem("highscore", score)
                }
                document.body.style.backgroundImage = ""
                document.body.style.backgroundColor = "#282A30"
                ctx.font = "4em cursive"
                ctx.fillStyle = "white"
                ctx.textAlign = "center"
                ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 3)
                ctx.font = "2em cursive"
                ctx.fillText("SCORE: " + score, canvas.width / 2, canvas.height / 3 + 150)
                ctx.fillText("HIGHSCORE: " + localStorage.getItem("highscore"), canvas.width / 2, canvas.height / 3 + 200)
                ctx.font = "1.5em cursive"
                ctx.fillText("PRESS 'SPACE' TO RELOAD", canvas.width / 2, canvas.height / 3 + 300)
                document.addEventListener('keydown', async function (e) {
                    if (e.keyCode === 32) {
                        window.location.reload()
                    }
                })
                clearInterval(draw)
            }

        }, 8)
    }

    return (
        <canvas
            ref={canvasRef}>
        </canvas>
    )

}

export default Main
