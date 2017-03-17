/**
 * 
 * @authors yutent (yutent@doui.cc)
 * @date    2016-04-11 00:07:23
 *
 */

"use strict";

let charsetRegExp = /;\s*charset\s*=/
let UTIL =  require('util')

class Response {

    constructor(req, res){
        this.req = req
        this.res = res
    }

    /**
     * [error http 错误显示]
     * @param  {Num} code [http错误码]
     * @param  {Str} msg  [错误提示信息]
     */
    error(msg, code = 500){
        this.res.writeHead(code, {'Content-Type': 'text/html; charset=utf-8'})
        this.end(`<fieldset><legend>Http Status: ${code}</legend><pre>${msg}</pre></fieldset>`)
    }

    setStatus(code = 404){
        this.res.writeHead(code)
    }


    /**
     * [append 往header插入信息]
     * @param  {[type]} key [description]
     * @param  {[type]} val [description]
     */
    append(key, val) {
        let prev = this.get(key);
        let value = val;

        if(prev){
            if(Array.isArray(prev))
                value = prev.concat(val)
            else if(Array.isArray(val))
                value = [prev].concat(val)
            else
                value = [prev, val]
        }
        return this.set(key, value);
    }

    /**
     * [redirect 页面跳转]
     * @param  {string} url [要跳转的URL]
     * @param  {bool} f   [是否永久重定向]
     */
    redirect(url, f = false){
        if(!/^(http[s]?|ftp):\/\//.test(url))
            url = '//' + url

        this.res.writeHead(f ? 301 : 302, {'Location': url})
        this.end('')
    }


    /**
     * [location 页面跳转(前端的方式)]
     */
    location(url){
        let html = `<html><head><script>location.href="${url}"</script></head></html>`
        this.render(html)
    }


    //以html格式向前端输出内容
    render(data, code = 200){
        data += ''
        this.set('Content-Type', 'text/html')
        this.set('Content-Length', Buffer.byteLength(data))
        if(code !== 200)
            this.setStatus(code)
        this.end(data)
    }

    //文件下载
    sendfile(data, filename){

        this.set('Content-Type', 'application/force-download')
        this.set('Accept-Ranges', 'bytes')
        this.set('Content-Length', Buffer.byteLength(data))
        this.set('Content-Disposition', `attachment;filename="${filename}"`)
        this.end(data)

    }

    /**
     * [send json格式输出]
     * @param  {Num}        code     [返回码]
     * @param  {Str}        msg      [提示信息]
     * @param  {Str/Obj}    data     [额外数据]
     * @param  {Str}        callback [回调函数名]
     */
    send(code = 200, msg = 'success', data = null, callback = null){

        if(!UTIL.isNumber(code)){
            msg = code + ''
            code = 400
        }else if(typeof msg === 'object'){
            data = msg
            msg = 'success'
            code = code || 200
        }

        let output = {
                code: code,
                msg: msg,
                data: data
            }
        output = JSON.stringify(output)

        if(callback){
            callback = callback.replace(/[^\w\-\.]/g, '')
            output = callback + '(' + output + ')'
        }

        this.set('Content-Type', 'application/json')
        this.set('Content-Length', Buffer.byteLength(output))
        
        //非200, 直接设置http状态为该code值
        if(code > 200)
            this.setStatus(code)

        this.end(output)
    }


    end(buf){
        this.res.end(buf || '')
    }



    
    /**
     * [get 读取已写入的头信息]
     */
    get(key){
        return this.res.getHeader(key)
    }

    /**
     * [set 设置头信息]
     */
    set(key, val){
        if(arguments.length === 2){
            let value = Array.isArray(val) ? val.map(String) : String(val)

            if(key.toLowerCase() === 'content-type' && !charsetRegExp.test(value))
                value += '; charset=utf-8'

            this.res.setHeader(key, value);
        }else{
            for(let i in key) {
                this.set(i, key[i]);
            }
        }
        return this;
    }


}



module.exports = Response