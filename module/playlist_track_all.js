// 通过传过来的歌单id拿到所有歌曲数据
// 支持传递参数limit来限制获取歌曲的数据数量 例如: /playlist/track/all?id=7044354223&limit=10

module.exports = (query, request) => {
  const data = {
    id: query.id,
    n: 100000,
    s: query.s || 8,
  }
  //不放在data里面避免请求带上无用的数据
  let limit = parseInt(query.limit) || Infinity
  let offset = parseInt(query.offset) || 0

  return request('POST', `https://music.163.com/api/v6/playlist/detail`, data, {
    crypto: 'api',
    cookie: query.cookie,
    ua: query.ua || '',
    proxy: query.proxy,
    realIP: query.realIP,
  }).then((res) => {
    let trackIds = res.body.playlist.trackIds
    let idsData = {
      c:
        '[' +
        trackIds
          .slice(offset, offset + limit)
          .map((item) => '{"id":' + item.id + '}')
          .join(',') +
        ']',
    }

    return request(
      'POST',
      `https://music.163.com/api/v3/song/detail`,
      idsData,
      {
        crypto: 'weapi',
        cookie: query.cookie,
        ua: query.ua || '',
        proxy: query.proxy,
        realIP: query.realIP,
      },
    )
  })
}
