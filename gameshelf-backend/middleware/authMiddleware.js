const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Geen token, toegang geweigerd' });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""), 
      process.env.JWT_SECRET
    );

    req.user = {
      _id: decoded.id
    };
    
    next();
  } catch (err) {
    console.error('[AUTH] Token verificatie fout:', err.message);
    res.status(401).json({ message: 'Ongeldig token' });
  }
}

module.exports = auth;