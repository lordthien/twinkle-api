const auth = (req, res, next) => {
    if (req._parsedOriginalUrl.href.indexOf('login') > 0) {
        const token = req.cookies.token
        if (token !== md5("thanhnguyen" + "123123")) {
            next()
        } else if(req._parsedOriginalUrl.href=='/admin') next()
        else res.redirect('/admin')
    }
    else try {
        const token = req.cookies.token
        if (token == md5("thanhnguyen" + "123123")) {
            next()
        } else {
            res.redirect('/admin/login')
        }
    } catch (e) {
        res.redirect('/admin/login')
    }
}
