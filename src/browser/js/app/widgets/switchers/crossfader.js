var Switcher = require('./switcher'),
    Fader = require('../sliders/fader'),
    {mapToScale, clip} = require('../utils')

var faderDefaults = Fader.defaults()


module.exports = class Crossfader extends Switcher {

    static defaults(){

        var o = super.defaults()
        o.type = 'crossfader'
        delete o.values

        return o

    }

    constructor(options) {

        options.props.values = options.props.horizontal ? ['A', 'B'] : ['B', 'A']

        super(options)

        this.fader = new Fader({props:{
            ...faderDefaults,
            horizontal: this.getProp('horizontal'),
            range: {min:{'A':0}, '50%':{" ":0.5},max:{'B':1}}
        }})

        this.fader.sendValue = ()=>{}

        this.widget.append($('<div class="fader-container"></div>').append(this.fader.widget))

        this.fader.on('change', (e)=>{

            e.stopPropagation = true

            this.setValue(this.fader.getValue(), e.options)

        })

    }

    setValue(v, options={}) {

        var v = v <= 0 || v == 'A' ?
                    'A' :
                    v >= 1 || v == 'B' ?
                        'B' :
                        v

        super.setValue(v, options)

        if (typeof v == 'object') {

            this.fader.setValue(this.value._fader, {dragged:options.dragged})

        }

        if (v == 'A') {

            this.fader.setValue(0, {dragged:options.dragged})
            this.value._fader = 0


        } else if (v == 'B') {

            this.fader.setValue(1, {dragged:options.dragged})
            this.value._fader = 1


        } else if (!isNaN(v)) {

            this.fader.setValue(v, {dragged:options.dragged})
            this.value._fader = this.fader.getValue()
            this.value._selected = false
            this.switch.setValue()

            var s = this.getValue(),
                a = {}

            for (var i in s['A']) {

                if (s['B'][i] === undefined) continue

                if (Array.isArray(s['A'][i])) {

                    a[i] = []

                    for (var k in s['A'][i]) {

                        if (!isNaN(s['A'][i][k])) {

                            a[i][k] = mapToScale(v, [0,1], [s['A'][i][k], s['B'][i][k]], false)

                        }

                    }

                } else if (!isNaN(s['A'][i])) {

                    a[i] = mapToScale(v, [0,1], [s['A'][i], s['B'][i]], false)
                }
            }

            this.applyState(a, options)

        }

    }

}
