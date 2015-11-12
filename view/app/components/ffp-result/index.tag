import store from './store'

<ffp-result>
  <dl>
    <dt>URL</dt>
    <dd>{ url }</dd>
    <dt>行番号</dt>
    <dd>{ position_y }</dd>
    <dt>文字番号</dt>
    <dd>{ position_x }</dd>
  </dl>

  <script>
    onFind (state) {
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


