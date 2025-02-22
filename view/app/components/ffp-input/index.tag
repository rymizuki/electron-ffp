import css from './style'
import { find } from './action-creator'

<ffp-input>
  <input type="text" onkeyup={ triggerInput } placeholder="http://localhost:9000/example.js:10:100">
  <button onclick={ triggerButton }>find</button>

  <style>{ css }</style>

  <script>
    triggerInput (e) {
      this.content = e.target.value
    }
    triggerButton () {
      find(this.content)
    }
  </script>
</ffp-input>
