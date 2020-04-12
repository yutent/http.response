![module info](https://nodei.co/npm/http.response.png?downloads=true&downloadRank=true&stars=true)

# http.response

> `http.response` is a module that let you can easily using on http server.

## Install

```bash
    npm install http.response
```

## Usage

```javascript
let Response = require('http.response'),
  http = require('http')

http
  .createServer((req, res) => {
    let response = new Response(req, res)

    // it eq. argument res
    console.log(response.res)

    response.set('content-type', 'text/html; charset=utf-8')
    response.end('hello world')
  })
  .listen(3000)
```

## API


### origin
> return the native request & response.



### error(msg[, code])

* msg `<String>`
* code `<Number>` optional

> It send msg to client for a friendly way.

```javascript
response.error('This is the error code', 500) //
response.error(null, 500) // null/empty, it will call the statusText back
response.error('Page not Found', 404) //
response.error(new Error('Auth denied'), 401) //
```

### status(code)

* code `<Number>`

> Set http status code.

```javascript
response.setStatus(501) //
response.setStatus(200) //
```

### set(key[, val])

* key `<String>` | `<Object>`
* code `<String>` | `<Number>`

> Set headers for response.

**Header will be replaced if it already exists.**
**chartset will be set if not define in `content-type`**

```javascript
response.set('content-type', 'text/html; charset=utf-8') //
response.set('content-type', 'text/html') // same result with above

response.set({'content-type', 'text/html', foo: 'bar'[, ...]})
```

### append(key, val)

* key `<String>`
* code `<String>` | `<Number>`

> Like set function, but it will not replace same field, just push it behind.

```javascript
response.append('name', 'foo')
response.append('name', 'bar') //客户端能同时看到foo和bar这2个值
```

### get(key)

* key `<String>`

> Get the headers from response, just use for previewing the content what will be send to client.

```javascript
response.set('name', 'foo')
response.get('name') // foo
```

### redirect(url[, f])

* url `<String>`
* f `<Boolean>` optional

> Redirect the url. It will be 302 if `f` is true, else 301.

```javascript
response.redirect('http://test.com/foo')
response.redirect('http://test.cn', true)
```

### location(url)

* url `<String>`

> Redirect the url. It base on frentend supported.

```javascript
response.location('http://test.com/foo')
response.location('/foo')
```

### render(data[, code])

* data `<String>` | `<Buffer>`
* code `<Number>` optional

> It will send client a html content.

```javascript
let html = fs.readFileSync('./index.html')
response.render(html) // send from a html file.

let txt = '<h1>hello doJS</h1>'
response.render(txt)

response.render("You're not able to here", 401) // set http status at the same time
```

### sendfile(data, filename)

* data `<String>` | `<Buffer>`
* filename `<String>`

> Send a file to client. It will be downloaded instead of previewing.

```javascript
let pic = fs.readFileSync('./boy.jpg')
response.sendfile(pic, 'a-little-boy.jpg') //
```

### send(code[, msg][, data][, callback])

* code `<Number>`
* msg `<String>` optional
* data `<Object>` optional
* callback `<String>` optional

> It send a `json` data to client.
> `code` is http status, default to 200;
> `msg` is some tips for the code;
> `data` is the extra content.
> `callback` is for json usage.

```javascript
response.send(200, 'ok', { foo: 'bar' })
// client will get the content like
// '{"code": 200, "msg": "ok", "data": {"foo": "bar"}}'

response.send(200, 'success', { name: 'foo', age: 16 }, 'blabla')
// client will get the content like
// 'blabla({"code": 200, "msg": "success", "data": {"name": "foo", "age": 16}})'
```

### end([data])

* data `<String>` | `<Buffer>` optional

> It just the res.end().
