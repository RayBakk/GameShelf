const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Geen token, toegang geweigerd' });
  }

  try {
    // Verwijder "Bearer " prefix en verifieer token
    const decoded = jwt.verify(
      token.replace("Bearer ", ""), 
      process.env.JWT_SECRET
    );

    // Cruciale aanpassing: Zorg dat req.user het correcte ID bevat
    req.user = {
      _id: decoded.id // of decoded.userId afhankelijk van je JWT payload
    };

    // Debug logging (tijdelijk toevoegen)
    console.log('[AUTH] Geverifieerde gebruiker ID:', req.user._id);
    console.log('[AUTH] Token payload:', decoded);

    next();
  } catch (err) {
    console.error('[AUTH] Token verificatie fout:', err.message);
    res.status(401).json({ message: 'Ongeldig token' });
  }
}

module.exports = auth;