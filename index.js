const cheerio = require('cheerio')
const fsPromises = require('fs/promises')
const path = require('path')

const jsonFilePath = path.join(process.cwd(), '/articles.json')

const url = "https://www.nytimes.com/topic/subject/veganism"

async function getArticles() {
    try {
        const response = await fetch(url)
        const html = await response.text()
        const $ = cheerio.load(html)

        const articles = []

        $('.css-112uytv').each(function (){

            const title = $(this).find('h3').text()
            const description = $(this).find('p').text()
            const image = $(this).find('img').attr('src')
            const author = $(this).find('.css-1n7hynb').text()
            const relativeUrl = $(this).find('a').attr('href')
            const url = 'https://www.nytimes.com' + relativeUrl
            const date = relativeUrl.substring(1,11)

            articles.push({
                title,
                description,
                image,
                author,
                date,
                url
            })

        })

    const articlesAsString = JSON.stringify(articles)
    await fsPromises.writeFile(jsonFilePath, articlesAsString)

    } catch (error) {
        console.log(error)
    }


}

getArticles()