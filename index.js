const launchChrome = require('@serverless-chrome/lambda');
const CDP = require('chrome-remote-interface');
const puppeteer = require('puppeteer');
const path = require('path');

exports.handler = async (event, context, callback) => {
    
    const {
        w = 1200,
        h = 630,
        mobile = false
      } = event.queryStringParameters || {}

    const path = event.path.replace(/^\//, "")
    const url = path.join(process.env.HOST, path.replace('.jpeg', ''))

    let slsChrome = null;   
    let browser = null;
    let page = null;

    try {
        slsChrome = await launchChrome({
            flags: [
                '--headless',
                '--disable-gpu',
                '--no-sandbox',
                '--window-size=1048,743',
                '--hide-scrollbars',
                '--enable-logging',
                '--ignore-certificate-errors',
                '--disable-setuid-sandbox',
            ]
        });
        
        browser = await puppeteer.connect({ 
            ignoreHTTPSErrors: true,
            browserWSEndpoint: (await CDP.Version()).webSocketDebuggerUrl 
        });

        page = await browser.newPage();

        page.setViewport({
            width: Number(w),
            height: Number(h)
        })
        
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36')

        await page.goto(url)
        
        await page.evaluate(() => {
            var style = document.createElement('style')
            style.textContent = `
                @import url('//fonts.googleapis.com/css?family=M+PLUS+Rounded+1c|Roboto:300,400,500,700|Material+Icons');
                div, input, a, p{ font-family: "M PLUS Rounded 1c", sans-serif; };`
            document.head.appendChild(style);
            document.body.style.fontFamily = "'M PLUS Rounded 1c', sans-serif";     
        })
        
        await page.waitFor(2000);

        const screenshotBuffer = await page.screenshot({
            type: 'jpeg',
            quality: 100,
            encoding: 'binary'
        });

        return callback(null, {
            statusCode: 200, 
            isBase64Encoded: true,
            headers: {
                "Content-Type": "image/jpeg",
            },
            body: screenshotBuffer.toString('base64')
        })
    } catch (err) {
        console.error(err);
        return callback(null, {
            statusCode: 500, 
            body: err
        });
    } finally {        
        if (page) {
            await page.close();
        }

        if (browser) {
            await browser.disconnect();
        }

        if (slsChrome) { 
            await slsChrome.kill();
        }
    }
};