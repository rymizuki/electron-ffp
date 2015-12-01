import store from './store'
import css from './style'

<ffp-loading>
  <div class="loading" show={ loading_fg }>
    <p>now loading ...</p>
  </div>

  <style>{ css }</style>

  <script>
    this.loading_fg = false

    onFindStart () {
      this.update({loading_fg: true})
    }

    onFindEnd () {
      this.update({loading_fg: false})
    }

    this.on('mount', function () {
      store.addFindStartListener(this.onFindStart)
      store.addFindListener(this.onFindEnd)
    })
    this.on('unmount', function () {
      store.removeFindStartListener(this.onFindStart)
      store.removeFindListener(this.onFindEnd)
    })
  </script>

</ffp-loading>
