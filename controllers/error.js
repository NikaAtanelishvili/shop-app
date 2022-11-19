// Rendering page not found
exports.pageNotFound = (req, res, next) => {
  res.status(404).render('page-not-found', {
    pageTitle: 'Page not found',
    path: null,
  })
}

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
  })
}
