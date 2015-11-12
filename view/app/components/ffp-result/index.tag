import store from './store'

<ffp-result>
  <div class="result" show={ body }>
    <dl>
      <dt>URL</dt>
      <dd>{ url }</dd>
      <dt>行番号</dt>
      <dd>{ position_y }</dd>
      <dt>文字番号</dt>
      <dd>{ position_x }</dd>
    </dl>
    <ffp-code-pretty />
  </div>

  <script>
    onFind (state) {
      console.log('receive state', state)
      this.update(state)
    }

    this.on('mount', function () {
      store.addFindListener(this.onFind)
    })
    this.on('unmount', function () {
      store.removeFindListener(this.onFind)
    })
  </script>
</ffp-result>

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

    this.on('update', function () {
      if (!this.body_beautify) return
      setTimeout(function () { // 処理を次のターンに回す
        this.root.scrollTop = (this.line_height * this.position_y_beautify) - (this.height / 2)
      }.bind(this), 1)
    })
  </script>
</ffp-code-pretty>
