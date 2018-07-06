import React, { Component } from 'react';

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const images = [
  "https://pamcarter.co.uk/files/cache/88090ad09668e0147f50a9da6178c2d7_f389.jpg",
  "https://img.buzzfeed.com/buzzfeed-static/static/2018-01/23/15/asset/buzzfeed-prod-fastlane-01/anigif_sub-buzz-27474-1516737829-1.gif?downsize=715:*&output-format=auto&output-quality=auto"
]

const CONSTANT = {
  PIECES: "PIECES",
  SOLUTION: "SOLUTION",
  EMPTY: -1
}

class App extends Component {
  state = {
    imageSrc: null,
    rows: 3,
    columns: 4,
    pieces: [],
    solution: [],
    correctAnswer: "antikismin",
    puzzleWidth: 0,
    inputText: ""
  }

  componentDidMount() {
    this.canvasImage = null
    this.reset(images[0])
  }

  selectImageSrc = src => e => {
    this.reset(src)
  }

  reset = imageSrc => {
    this.setState({
      puzzleWidth: this.puzzleContainer.getBoundingClientRect().width
    }, () => {
      let img = new Image()
      img.onload = () => {
        this.setState({ imageSrc })
        this.createPuzzle()
      }
      img.src = imageSrc
      this.canvasImage = img
    })
  }

  createPuzzle = () => {
    const { rows, columns } = this.state
    const pieces = shuffleArray(Array(rows * columns).fill(0).map((value, index) => index))
    const solution = Array(rows * columns).fill(CONSTANT.EMPTY)
    let correctAnswer = pieces.slice()
    correctAnswer.sort((a, b) => a - b)
    correctAnswer = correctAnswer.toString()
    this.setState({ pieces, solution, correctAnswer })
  }

  onDragStart = (index, source) => e => {
    const { rows, columns, puzzleWidth } = this.state
    const canvas = this.canvas
    canvas.width = puzzleWidth / columns
    canvas.height = puzzleWidth / rows

    const ctx = canvas.getContext("2d")
    const background = this.canvasImage
    const dx = -canvas.width * (index % columns)
    const dy = -canvas.height * (Math.floor(index / columns))
    ctx.drawImage(background, dx, dy, puzzleWidth, puzzleWidth)

    e.dataTransfer.setData("pieceId", index)
    e.dataTransfer.setData("source", source)
    e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2)
  }

  onDragOver = e => {
    e.preventDefault()
  }

  onDrop = (dropIndex, destination) => e => {
    e.preventDefault()
    const pieceId = parseInt(e.dataTransfer.getData("pieceId"), 10)
    const source = e.dataTransfer.getData("source")

    this.setState(prevState => {
      let pieces = prevState.pieces.slice()
      let solution = prevState.solution.slice()
      if (source === CONSTANT.PIECES) {
        if (destination === CONSTANT.PIECES) {
          if (pieces[dropIndex]) {
            // pieces to pieces && occupied => swap
            pieces[pieces.indexOf(pieceId)] = pieces[dropIndex]
            pieces[dropIndex] = pieceId
          } else {
            // pieces to pieces && unoccupied => move
            pieces[pieces.indexOf(pieceId)] = 0
            pieces[dropIndex] = pieceId
          }
        } else if (destination === CONSTANT.SOLUTION) {
          if (solution[dropIndex]) {
            // pieces to solution && occupied => swap
            pieces[pieces.indexOf(pieceId)] = solution[dropIndex]
            solution[dropIndex] = pieceId
          } else {
            // pieces to solution && unoccupied => move
            pieces[pieces.indexOf(pieceId)] = 0
            solution[dropIndex] = pieceId
          }
        }
      } else if (source === CONSTANT.SOLUTION) {
        if (destination === CONSTANT.PIECES) {
          if (pieces[dropIndex]) {
            // solution to pieces && occupied => swap
            solution[solution.indexOf(pieceId)] = pieces[dropIndex]
            pieces[dropIndex] = pieceId
          } else {
            // solution to pieces && unoccupied => move
            solution[solution.indexOf(pieceId)] = 0
            pieces[dropIndex] = pieceId
          }
        } else if (destination === CONSTANT.SOLUTION) {
          if (solution[dropIndex]) {
            // solution to solution && occupied => swap
            solution[solution.indexOf(pieceId)] = solution[dropIndex]
            solution[dropIndex] = pieceId
          } else {
            // solution to solution && unoccupied => move
            solution[solution.indexOf(pieceId)] = 0
            solution[dropIndex] = pieceId
          }
        }
      }
      return { pieces, solution }
    })
  }

  render() {
    const {
      imageSrc,
      rows,
      columns,
      pieces,
      solution,
      correctAnswer,
      puzzleWidth,
      inputText
    } = this.state
    const solved = solution.toString() === correctAnswer

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          width: "100vw",
          height: "100vh"
        }}
      >
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "gold",
            padding: 20
          }}
        >
          <div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                this.setState({ inputText: e.target.value })
              }}
              placeholder="Put image url here and press change image.."
            />
            <button type="button" onClick={() => { this.reset(inputText)}}>Change Image</button>
          </div>
          <p style={{ fontSize: 13 }}>Or just click on images below.. (gif is fun)</p>
          <div
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                marginLeft: 30,
                marginRight: 30,
                marginBottom: 30
              }}
            >
              <img
                src={images[0]}
                onClick={this.selectImageSrc(images[0])}
                alt="puzzle source"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: "pointer"
                }}
              />
            </div>
            <div
              style={{
                width: 200,
                height: 200,
                marginLeft: 30,
                marginRight: 30,
                marginBottom: 30
              }}
            >
              <img
                src={images[1]}
                onClick={this.selectImageSrc(images[1])}
                alt="puzzle source"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: "pointer"
                }}
              />
            </div>
            <canvas
              ref={el => {this.canvas = el}}
              style={{
                position: "absolute",
                top: "-100vh",
                left: "-100vw"
              }}
            />
          </div>
          <div
            style={{
              width: "50%",
              paddingBottom: "50%",
              position: "relative"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto ".repeat(columns).trimRight(),
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                border: "1px dashed rgba(0, 0, 0, 0.75)"
              }}
            >
              {
                pieces.map((pieceId, index) => (
                  <div
                    key={index}
                    style={{
                      borderRight: (index + 1) % columns === 0 ? undefined : "1px dashed rgba(0, 0, 0, 0.75)",
                      borderBottom: index + 1 > (rows - 1) * columns ? undefined : "1px dashed rgba(0, 0, 0, 0.75)"
                    }}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop(index, CONSTANT.PIECES)}
                  >
                    {
                      pieceId !== CONSTANT.EMPTY &&
                      <div
                        draggable={true}
                        onDragStart={this.onDragStart(pieceId, CONSTANT.PIECES)}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "move"
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt="puzzle-piece"
                          style={{
                            position: "absolute",
                            top: `${Math.floor(pieceId / columns) * -100}%` ,
                            left: `${(pieceId % columns) * -100}%`,
                            width: `${puzzleWidth}px`,
                            height: `${puzzleWidth}px`
                          }}
                        />
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </aside>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "aliceblue",
            padding: 20
          }}
        >
          <div
            style={{
              marginBottom: 30
            }}
          >
            <img
              src={imageSrc}
              alt="puzzle guide"
              style={{
                maxWidth: 300,
                maxHeight: 300
              }}
            />
          </div>
          <p
            style={{
              color: solved ? "#B4D455" : "red"
            }}
          >{solved ? "SOLVED!" : "UNSOLVED"}</p>
          <div
            style={{
              width: "50%",
              paddingBottom: "50%",
              position: "relative"
            }}
          >
            <div
              ref={el => {this.puzzleContainer = el}}
              style={{
                display: "grid",
                gridTemplateColumns: "auto ".repeat(columns).trimRight(),
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                border: "1px dashed rgba(0, 0, 0, 0.75)"
              }}
            >
              {
                solution.map((pieceId, index) => (
                  <div
                    key={index}
                    style={{
                      borderRight: (index + 1) % columns === 0 ? undefined : "1px dashed rgba(0, 0, 0, 0.75)",
                      borderBottom: index + 1 > (rows - 1) * columns ? undefined : "1px dashed rgba(0, 0, 0, 0.75)"
                    }}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop(index, CONSTANT.SOLUTION)}
                  >
                    {
                      pieceId !== CONSTANT.EMPTY &&
                      <div
                        draggable={true}
                        onDragStart={this.onDragStart(pieceId, CONSTANT.SOLUTION)}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "move"
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt="puzzle-piece"
                          style={{
                            position: "absolute",
                            top: `${Math.floor(pieceId / columns) * -100}%` ,
                            left: `${(pieceId % columns) * -100}%`,
                            width: `${puzzleWidth}px`,
                            height: `${puzzleWidth}px`
                          }}
                        />
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default App
