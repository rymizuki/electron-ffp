import store from './store'
import css   from './style'

<ffp-result>
  <dl show={ this.url }>
    <dt class="label">URL</dt>
    <dd class="data type-url">{ url }</dd>
    <dt class="label">行番号</dt>
    <dd class="data">{ position_y }</dd>
    <dt class="label">文字番号</dt>
    <dd class="data">{ position_x }</dd>
  </dl>

  <style>{ css }</style>

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


