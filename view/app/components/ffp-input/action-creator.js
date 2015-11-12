import dispatcher   from 'app/dispatcher'
import action_types from 'app/action-types'
import qwest        from 'qwest'
import beautify     from 'js-beautify'

export function find (target) {
  let matches
  if (target && (matches = target.match(/(https?:\/\/.+?)(:[0-9]+)(:[0-9]+)$/))) {
    let url         = matches[1]
    let position_y  = matches[2].replace(/:/, '')
    let position_x  = matches[3].replace(/:/, '')

    dispatcher.handleViewAction({
      type: action_types.FIND_START,
      target: target,
      url,
      position_x,
      position_y,
    })

    qwest.get(url)
      .then((res, body) => {
        let lines = []
        let line_stuff = body.split(/\r?\n/)
        for (let yindex=0; yindex<line_stuff.length; yindex++) {
          let line
          if ((yindex + 1) == position_y) {
            let char_sutff = line_stuff[yindex].split('')
            let chars = []
            for (let xindex=0; xindex<char_sutff.length; xindex++) {
              chars.push(char_sutff[xindex])
              if ((xindex + 1) == position_x) chars.push('/* FFP_TARGET */')
            }
            line = chars.join('')
          } else {
            line = line_stuff[yindex]
          }
          lines.push(line)
        }
        let content = lines.join('\n')
        let content_beautify = beautify(content, { indent_size: 2 })
        let lines_beautify = content_beautify.split(/\r?\n/)

        let position_y_beautify = 0
        for (let index=0; index<lines_beautify.length; index++) {
          if (/\/\* FFP_TARGET \*\//.test(lines_beautify[index])) {
            position_y_beautify = index + 1
          }
        }

        dispatcher.handleViewAction({
          type: action_types.FIND,
          url,
          position_x,
          position_y,
          position_y_beautify,
          body: content,
          body_beautify: content_beautify,
        })
      })
      .catch(() => {
        console.error('response failed', res)
      })
  } else {
    console.error('invalid')
  }
}
