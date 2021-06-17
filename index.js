const axios=require('axios');
const cheerio=require('cheerio');
const express=require('express');
const { copyFileSync } = require('fs');

async function getPriceFeed(){
    try{
      const siteUrl='https://coinmarketcap.com/'
      const {data} =await axios({
        method:'GET',
        url:siteUrl,
    })
    const $=cheerio.load(data)
    const elemSelector='#__next > div.bywovg-1.sXmSU > div.main-content > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div > div.tableWrapper___3utdq.cmc-table-homepage-wrapper___22rL4 > table > tbody > tr'
    const keys=[
      'rank',
      'name',
      'price',
      '24h%',
      '7d%',
      'marketcap',
      'volume',
      'circulatingSupply'

    ]
    
    const coinArr=[]
    
    $(elemSelector).each((parentIdx,parentElem)=>{
        let keyIdx=0
        const coinObj={}
        if(parentIdx<=9){
            $(parentElem).children().each((childIdx,childElem)=>{
              let tdValue=$(childElem).text()
             if(tdValue){
                   coinObj[keys[keyIdx]]=tdValue
                   keyIdx++
               }
            })
            coinArr.push(coinObj)
        }
    })
    return coinArr;
    }
    catch(err){
      console.log(err)
    }
}

const app=express()
app.get('/api/price-feed',async(req,res)=>{
    try{
         const priceFeed=await getPriceFeed()
         return res.status(200).json({
             result:priceFeed,
         })
    }
    catch(error){
        return res.status(500).json({
            err:err.toString(),
        })
    }
})

app.listen(3000,()=>{
    console.log("server run on port 3000")
})