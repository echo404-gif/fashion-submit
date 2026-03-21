import sharp from 'sharp'
await sharp('public/cursor-arrow.png').resize(32, 32, {fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).toFile('public/cursor-arrow-32.png')
await sharp('public/cursor-hand.png').resize(32, 32, {fit:'contain', background:{r:0,g:0,b:0,alpha:0}}).toFile('public/cursor-hand-32.png')
console.log('done')
