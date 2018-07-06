import React, { Component } from 'react';

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  let shuffled = array.slice()
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // eslint-disable-line no-param-reassign
  }
  return shuffled
}

class App extends Component {
  state = {
    imageSrc: "https://pamcarter.co.uk/files/cache/88090ad09668e0147f50a9da6178c2d7_f389.jpg",
    rows: 3,
    columns: 4,
    pieces: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    solution: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    puzzleWidth: 0
  }

  componentDidMount() {
    const { imageSrc } = this.state
    this.setState({
      puzzleWidth: this.puzzleContainer.getBoundingClientRect().width
    }, () => {
      this.canvasAssets = []
      this.preloadImages(
        [imageSrc],
        this.canvasAssets,
        this.createPuzzle
      )
    })
  }

  preloadImages(srcs, imgs, callback) {
    let img
    let remaining = srcs.length
    const removeFinished = () => {
      remaining--
      if (remaining <= 0) {
        callback()
      }
    };

    for (let i = 0; i < srcs.length; i++) {
      img = new Image()
      img.onload = removeFinished
      img.src = srcs[i]
      imgs.push(img)
    }
  }

  createPuzzle = () => {
    const { rows, columns } = this.state
    const pieces = shuffleArray(Array(rows * columns).fill(0).map((value, index) => index))
    this.setState({ pieces })
  }

  onPieceDragStart = index => {
    return e => {
      const { rows, columns, puzzleWidth } = this.state
      const canvas = this.canvas
      canvas.width = puzzleWidth / columns
      canvas.height = puzzleWidth / rows

      const ctx = canvas.getContext("2d")
      const background = this.canvasAssets[0]
      const dx = -canvas.width * (index % columns)
      const dy = -canvas.height * (Math.floor(index / columns))
      ctx.drawImage(background, dx, dy, puzzleWidth, puzzleWidth)

      e.dataTransfer.setData("text/plain", index)
      e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2)
    }
  }

  render() {
    const { imageSrc, rows, columns, pieces, solution, puzzleWidth } = this.state

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
            background: "gold"
          }}
        >
          <div style={{display: "flex", alignItems: "center"}}>
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
                ref={el => {this.puzzleThumbnail = el}}
                src={imageSrc}
                alt="puzzle source"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
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
                border: "1px solid rgba(0, 0, 0, 0.75)"
              }}
            >
              {
                pieces.map((pieceId, index) => (
                  <div
                    key={index}
                    draggable={true}
                    onDragStart={this.onPieceDragStart(index)}
                    style={{
                      borderRight: (index + 1) % columns === 0 ? undefined : "1px solid rgba(0, 0, 0, 0.75)",
                      borderBottom: index + 1 > (rows - 1) * columns ? undefined : "1px solid rgba(0, 0, 0, 0.75)",
                      position: "relative",
                      overflow: "hidden"
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
                ))
              }
            </div>
          </div>
        </aside>
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "aliceblue"
          }}
        >
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
                solution.map((piece, index) => (
                  <div
                    key={index}
                    style={{
                      borderRight: (index + 1) % columns === 0 ? undefined : "1px dashed rgba(0, 0, 0, 0.75)",
                      borderBottom: index + 1 > (rows - 1) * columns ? undefined : "1px dashed rgba(0, 0, 0, 0.75)"
                    }}
                  >
                    
                  </div>
                ))
              }
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
