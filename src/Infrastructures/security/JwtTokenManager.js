const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError')

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }

  async verifyAccessToken(token) {
    try {
      const artifacts = this._jwt.decode(token)
      this._jwt.verify(artifacts, process.env.ACCESS_TOKEN_KEY)
    } catch (error) {
      throw new InvariantError('access token tidak valid')
    }
  }

  async getTokenFromHeader(header) {
    try {
      if (!header) throw new AuthenticationError('header tidak valid')
      const headerArray = header.split(" ")
      const token = headerArray[1]
      return token
    } catch (error) {
      throw new AuthenticationError('header tidak valid')
    }
  }
}

module.exports = JwtTokenManager;