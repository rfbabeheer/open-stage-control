require('./app/globals')
require('./app/sourcemap')

var ipc = require('./app/ipc/'),
    osc = require('./app/osc'),
    parser = require('./app/parser'),
    {loading} = require('./app/utils')

ipc.init()
osc.init()
parser.init()

$(document).ready(function(){
    LOADING = loading('Connecting server...')
    require('./app/ui')
    ipc.send('ready')
})
