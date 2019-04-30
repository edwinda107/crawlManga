const cheerio = require('cheerio') ; 
const axios = require('axios') ; 
var dataMAn ;
function delay(time){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,time) ;
    }); 
}
async function getSource(linkSource){
    let sourceCode ; 
    await axios.get(linkSource)
    .then(function(response){
        sourceCode = response.data ; 
    });
    return sourceCode ; 
}
async function getPageEachChap(crawlChaps){
    var dataMan = [] ; 
    let work = async function(){
        for (let i = 0 ; i < crawlChaps.length ; i++){
            let page = [] ; 
            let sourceChap = await getSource(crawlChaps[i].source) ; 
            let $ = cheerio.load(sourceChap) ;  
            $('.reading-detail.box_doc').find('div>div>img').each(function(j,ele){
                page.push(/*{
                    indexPage : j, source : $(ele).attr('src') 
                }*/
                    $(ele).attr('src') 
                ) ; 
            });
            dataMan.push({index : i ,page}) ; 
        }
    }() ;
    await delay(60000) ; 
    console.log(dataMan) ;
}
async function whatdoyoumean(linkMan){
    let chaps = [] ; 
    let sourceCode = await getSource(linkMan);
    var crawlChaps = [] ; 
    let getcrawlsChaps = await function(sourceCode){
        const $ = cheerio.load(sourceCode) ; 
        $('.list-chapter').find('nav>ul>li>div>a')/*.attr('href'))*/.each(function(i,ele){
            //console.log(ele) ; 
            crawlChaps.push($(ele).attr('href')) ;
        }); 
        crawlChaps.reverse() ; 
        for (let i = 0 ; i < crawlChaps.length; i++){
            crawlChaps[i] = {index : i , source : crawlChaps[i]} 
        } 
    }(sourceCode) ;  
    await getPageEachChap(crawlChaps) ; 
}
whatdoyoumean('http://www.nettruyen.com/truyen-tranh/chao-mung-den-voi-lop-hoc-thuong-dang') ;