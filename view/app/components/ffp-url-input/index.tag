import { find } from './action-creator'

<ffp-url-input>
  <input type="text" onkeyup={ triggerInput } placeholder="">
  <button onclick={ triggerButton }>find</button>

  <script>
    triggerInput (e) {
      this.content = e.target.value
    }
    triggerButton () {
      find(this.content)
    }
  </script>
</ffp-url-input>
