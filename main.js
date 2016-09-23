let body = document.getElementsByTagName('body')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let cWidth = ctx.canvas.width
let cHeight = ctx.canvas.height

function normalize(vector) {
  let length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
  return {
    x: vector.x / length,
    y: vector.y / length
  }
}

function mix(v1, v2) {
  return normalize({
    x: (v1.x + v2.x) / 100,
    y: (v1.y + v2.y)/ 5,
  })
}


function averagePosition(units) {
  if (!units.length) return false

  let position = units.reduce((old, unit) => {
    return {
      x: old.x + unit.x,
      y: old.y + unit.y,
    }
  }, {x: 0, y: 0})

  return {
    x: Math.round(position.x / units.length),
    y: Math.round(position.y / units.length),
  }
}

let units = []

let getUnitsInRadius = (currentUnit, radius, type) => {
  return units.filter(unit => unit.type === type && Math.sqrt(Math.pow(unit.x - currentUnit.x, 2) + Math.pow(unit.y - currentUnit.y, 2)) < radius)
}

let createUnit = () => {

  return {
    type: 'unit',
    x: Math.random() * cWidth,
    y: Math.random() * cHeight,
    v: Math.random() * 2,
    d: normalize({x: Math.random() * 2 - 1, y: Math.random() * 2 - 1}),
    r: 2,

    move ()  {
      let units = getUnitsInRadius(this, 50, 'unit')
      let position = averagePosition(units)

      if (position) {
        let direction = {
          x: position.x - this.x,
          y: position.y - this.y
        }

        direction = normalize(direction)


        this.d = direction

      }


      this.x += this.d.x * this.v
      this.y += this.d.y * this.v

      this.handleWalls()
    },

    draw () {
      ctx.beginPath()
      ctx.fillStyle = "rgb(0,0,0)"
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
      ctx.fill()
    },

    handleWalls () {
      if (this.x < 0 || this.x > cWidth) this.d.x = -this.d.x
      if (this.y < 0 || this.y > cHeight) this.d.y = -this.d.y
    }

  }

}

let createPredator = () => {

  return {
    type: 'predator',
    x: Math.random() * cWidth,
    y: Math.random() * cHeight,
    v: Math.random() * 5,
    d: normalize({x: Math.random(), y: Math.random()}),
    r: 5,

    move ()  {
      this.r += getUnitsInRadius(this, this.r, 'unit').length / this.r

      let units = getUnitsInRadius(this, 50, 'unit')
      let position = averagePosition(units)

      if (position) {
        let direction = {
          x: position.x - this.x,
          y: position.y - this.y
        }

        direction = normalize(direction)

        direction = {
          x: -direction.x,
          y: -direction.y
        }

        this.d = direction

        this.handleWalls()
      }


      this.x += this.d.x * this.v
      this.y += this.d.y * this.v
    },

    draw () {
      ctx.beginPath()
      ctx.fillStyle = "rgb(255,0,0)"
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
      ctx.fill()
    },

    handleWalls () {
      if (this.x < 0 || this.x > cWidth) this.d.x = -this.d.x
      if (this.y < 0 || this.y > cHeight) this.d.y = -this.d.y
    }

  }

}


let drawUnits = () => {
  units.forEach(unit => unit.draw())
}

let moveUnits = () => {
  units.forEach(unit => unit.move())
}


let loop = () => {
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, cWidth, cHeight);

  moveUnits()
  drawUnits()

  window.requestAnimationFrame(loop)
}


let init = () => {


  for (let i = 0; i < 500; i++) {
    units.push(createUnit())
  }

  // for (let i = 0; i < 10; i++) {
  //   units.push(createPredator())
  // }

  loop()

  //console.log(getUnitsInRadius(units[10], 50))

}


window.addEventListener("load", init)
