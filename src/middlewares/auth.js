const adminAuth = (req, res, next) => {
  console.log('checking authorization for admin route');
  const token = 'xyz';
  const isAdminAuthorized = token === 'xyz';
  if (isAdminAuthorized) {
    console.log('admin authorized');
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

const userAuth = (req, res, next) => {
  console.log('checking authorization for user route');
  const token = 'xyz';
  const isAdminAuthorized = token === 'xyz';
  if (isAdminAuthorized) {
    console.log('user authorized');
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
