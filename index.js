const express = require('express')

const app = express()

const cheeiro = require('cheerio')

const rp = require('request-promise')

const cors = require('cors')

const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json({ success: 'Booking Api online' })
})

app.get('/v1', async(req, res) => {
    const url = req.query.url 

    try {
        
            const config = {
                uri: url,
                transform: async function(body) {
                    return await cheeiro.load(body)
                }
            } 
    
            rp(config).then($ => {
                const name = $('.hp__hotel-name').text().replace('\n', ' ').replace('\n', ' ').replace('\n', ' ')
                const address = $('.hp_address_subtitle').text().replace('\n', ' ').replace('\n', ' ')
                const score = {
                    name: [],
                    note: []
                }
    
    
    
                $('#review_list_score_breakdown').each((i, item) => {
    
                    $('.review_score_name').each((i, item) => {
                        const scores = $(item).text()        
                        score.name.push(scores)
                    }) 
    
                    $('.review_score_value').each((i, item) => {
                        const scores =  $(item).text()
                        score.note.push(scores)
                    }) 
    
                })
    
                const amenities = parseFloat(score.note[0].replace(',', '.'))
                const cleaning = parseFloat(score.note[1].replace(',', '.'))
                const confort = parseFloat(score.note[2].replace(',', '.'))
                const cost_benefitscore = parseFloat(score.note[3].replace(',', '.'))
                const location = parseFloat(score.note[4].replace(',', '.'))
                const rating = parseFloat(score.note[5].replace(',', '.'))
                const wifi = parseFloat(score.note[6].replace(',', '.'))
    
                if (!rating)
                    return false
    
                res.status(200).json({ 
                    name,
                    address,
                    rating,
                    amenities,
                    cleaning,
                    confort,
                    cost_benefitscore,
                    location,
                    wifi,
                    votes: {
                        fantastic: parseFloat(score.note[7]),
                        good: parseFloat(score.note[8]),
                        ok: parseFloat(score.note[9]),
                        bad: parseFloat(score.note[10]),
                        very_bad: parseFloat(score.note[11])
                    }
                })
            })


    } catch (error) {
        res.status(400).json({ error })
    }
    
})



app.listen(3000)