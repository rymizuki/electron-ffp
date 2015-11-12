import store from './store'
import css   from './style'

<ffp-code-pretty>
  <pre>
    <code>
      <ol>
        <li
          each={ line in body_beautify.split(/\r?\n/) }
          class={'is-highlight': line.match(/FFP_TARGET/)}
          style="line-height: { line_height }; font-size: { font_size }px;"
          >{ line }</li>
      </ol>
    </code>
  </pre>

  <style>{ css }</style>

  <script>
    this.font_size    = 13;
    this.line_height  = 1.5;
    this.height       = this.root.clientHeight
    this.scroller     = null

    onFind (state) {
      this.update(state)
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
        if (!this.scroller) this.scroller = this.root.getElementsByTagName('pre')[0]
        setTimeout(() => { // 1ターン遅延
          this.scroller.scrollTop = (Math.floor(this.font_size * this.line_height) * (this.position_y_beautify - 1)) - (this.height / 2)
        }, 1)
      }
    })
  </script>
</ffp-code-pretty>
