import store from './store'

<ffp-code-pretty>
  <pre>
    <code>
      <ol>
        <li
          each={ line in body_beautify.split(/\r?\n/) }
          class={'is-highlight': line.match(/FFP_TARGET/)}
          style="line-height: { line_height }px;"
          >{ line }</li>
      </ol>
    </code>
  </pre>

  <style scoped>
    :scope {
      display: block;
      overflow: scroll;
      width:  100%;
      height: 300px;
    }
    :scope .is-highlight {
      background: #F8EEC7;
    }
  </style>

  <script>
    this.line_height  = 16;
    this.height       = this.root.clientHeight

    onFind (state) {
      // 実行を1ターン遅らせる
      // これによって、 `ffp-result` の表示が優先される
      setTimeout(() => { 
        this.update(state)
      }, 1)
    }

    this.on('mount', function () {
      this.height = this.root.clientHeight
      store.addFindListener(this.onFind)
    })

    this.on('unmount', function () {
      store.removeFindListener(this.onFind)
    })

    this.on('update', function () {
      if (this.body_beautify) {
        setTimeout(() => { // 1ターン遅延
          this.root.scrollTop = (this.line_height * this.position_y_beautify) - (this.height / 2)
        }, 1)
      }
    })
  </script>
</ffp-code-pretty>
